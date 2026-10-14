// Cloudflare Worker entry for alexanderar-site.
//
// Static assets are still served first by the Workers static-assets layer;
// this script only receives requests that do NOT match a file in dist/client.
// Today that is exactly one route:
//
//   GET /api/lastfm — live Last.fm snapshot (same shape as src/data/music.json)
//
// The Last.fm API has no CORS, so the browser cannot call it directly.
// This proxy keeps the API key server-side and caches the JSON at the edge
// for 45s, so every visitor polling every minute still costs Last.fm ~1
// request per minute in total — not one per visitor.

const LASTFM_API = 'https://ws.audioscrobbler.com/2.0/';
const USERNAME = 'Alexander_110';
const CACHE_TTL = 25; // seconds at the edge

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
    image: imageOf(t.image),
    playcount: Number(t.playcount) || 0,
  };
}

async function lastfmCall(env, method, params) {
  const qs = new URLSearchParams({
    method,
    user: USERNAME,
    api_key: env.LASTFM_API_KEY ?? '',
    format: 'json',
    ...params,
  });
  const res = await fetch(`${LASTFM_API}?${qs}`);
  if (!res.ok) throw new Error(`${method} -> HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`${method} -> Last.fm error ${json.error}: ${json.message}`);
  return json;
}

async function buildSnapshot(env) {
  const [recent, artists, tracks] = await Promise.all([
    lastfmCall(env, 'user.getRecentTracks', { limit: '25' }).then((j) => (j.recenttracks?.track ?? []).map(mapTrack)),
    lastfmCall(env, 'user.getTopArtists', { period: '1month', limit: '10' }).then((j) =>
      (j.topartists?.artist ?? []).map(mapArtist),
    ),
    lastfmCall(env, 'user.getTopTracks', { period: '1month', limit: '10' }).then((j) =>
      (j.toptracks?.track ?? []).map(mapTopTrack),
    ),
  ]);
  return { username: USERNAME, recent, topArtists: artists, topTracks: tracks, fetchedAt: new Date().toISOString() };
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/lastfm') {
      if (!env.LASTFM_API_KEY) {
        return jsonResponse({ error: 'LASTFM_API_KEY is not configured on this worker' }, 503);
      }

      // Edge cache: one shared JSON per 45s regardless of visitor count.
      const cache = caches.default;
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const snapshot = await buildSnapshot(env);
        const res = jsonResponse(snapshot, 200, { 'cache-control': `public, max-age=${CACHE_TTL}` });
        ctx.waitUntil(cache.put(request, res.clone()));
        return res;
      } catch (err) {
        // Serve a stale-but-useful error; the page keeps its build snapshot.
        return jsonResponse({ error: String(err) }, 502);
      }
    }

    // Everything else falls through to the static assets (incl. the 404 page).
    return env.ASSETS.fetch(request);
  },
};
