// Build-time Last.fm snapshot — same contract as fetch-github.mjs.
// Runs on every build and nightly via .github/workflows/refresh-lastfm.yml.
// Never fails the build: with no LASTFM_API_KEY (or on any API error) it
// keeps the previous src/data/music.json untouched.
//
//   LASTFM_API_KEY  — required to fetch (create a free one at
//                     https://www.last.fm/api/account/create)
//   LASTFM_USERNAME — defaults to Alexander_110

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'data', 'music.json');

const USERNAME = process.env.LASTFM_USERNAME ?? 'Alexander_110';
const API_KEY = process.env.LASTFM_API_KEY ?? '';
const API = 'https://ws.audioscrobbler.com/2.0/';

let previous = null;
if (existsSync(outPath)) {
  try {
    previous = JSON.parse(readFileSync(outPath, 'utf8'));
  } catch {
    previous = null;
  }
}

if (!API_KEY) {
  console.warn('[lastfm] LASTFM_API_KEY not set — keeping the previous music.json.');
  process.exit(0);
}

async function callApi(method, params) {
  const qs = new URLSearchParams({ method, user: USERNAME, api_key: API_KEY, format: 'json', ...params });
  const res = await fetch(`${API}?${qs}`);
  if (!res.ok) throw new Error(`${method} -> HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`${method} -> Last.fm error ${json.error}: ${json.message}`);
  return json;
}

function imageOf(images) {
  const last = Array.isArray(images) ? images[images.length - 1] : null;
  return typeof last?.['#text'] === 'string' && last['#text'] ? last['#text'] : undefined;
}

function mapTrack(t) {
  return {
    name: t.name,
    artist: t.artist?.['#text'] ?? '',
    url: t.url || undefined,
    image: imageOf(t.image),
    // uts is absent on the now-playing row.
    date: t.date?.uts ? Number(t.date.uts) * 1000 : null,
    nowPlaying: t['@attr']?.nowplaying === 'true',
  };
}

function mapArtist(a) {
  return { name: a.name, playcount: Number(a.playcount) || 0, url: a.url || undefined, image: imageOf(a.image) };
}

function mapTopTrack(t) {
  return {
    name: t.name,
    artist: t.artist?.name ?? '',
    url: t.url || undefined,
    playcount: Number(t.playcount) || 0,
  };
}

async function fetchSnapshot() {
  const [recent, artists, tracks] = await Promise.all([
    callApi('user.getRecentTracks', { limit: '25' }).then((j) => (j.recenttracks?.track ?? []).map(mapTrack)),
    callApi('user.getTopArtists', { period: '1month', limit: '10' }).then((j) =>
      (j.topartists?.artist ?? []).map(mapArtist),
    ),
    callApi('user.getTopTracks', { period: '1month', limit: '10' }).then((j) =>
      (j.toptracks?.track ?? []).map(mapTopTrack),
    ),
  ]);
  return { recent, topArtists: artists, topTracks: tracks };
}

let snapshotData = null;
try {
  snapshotData = await fetchSnapshot();
} catch (err) {
  console.warn('[lastfm] fetch failed, keeping the previous music.json:', String(err));
}

const snapshot = {
  username: USERNAME,
  // Keep the previous data when offline so the page never flashes empty.
  ...(snapshotData ?? {
    recent: previous?.recent ?? [],
    topArtists: previous?.topArtists ?? [],
    topTracks: previous?.topTracks ?? [],
  }),
  fetchedAt: new Date().toISOString(),
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');
console.log(
  `[lastfm] snapshot written: ${snapshot.recent.length} recent, ${snapshot.topArtists.length} top artists` +
    (snapshotData ? '' : ' (kept previous — fetch failed)'),
);
