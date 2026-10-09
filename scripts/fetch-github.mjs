// Build-time GitHub snapshot, mirroring elianiva.com's GitHubService.
// Runs on `prebuild` and nightly via `.github/workflows/refresh-github.yml`.
// Never fails the build: on any API error it keeps the previous snapshot
// (or writes an empty one on first run).
//
//   GH_TOKEN (optional) — raises REST rate limit 60 -> 5000 req/hour and
//                          enables the exact GraphQL contribution calendar.
//   GITHUB_USERNAME      — defaults to AlexanderDev2004.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'data', 'github.json');

const USERNAME = process.env.GITHUB_USERNAME ?? 'AlexanderDev2004';
const TOKEN = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? '';
// elianiva uses MIN_STARS=100; kept at 0 here so small collaboration repos
// (e.g. git_trace, Rusuh) still show up — the signal is "merged by others".
const MIN_STARS = 0;
const DAY_MS = 86_400_000;

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'alexanderar-fetch-github',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

function trailingYear(now = Date.now()) {
  return {
    from: new Date(now - 365 * DAY_MS).toISOString(),
    fromDate: new Date(now - 365 * DAY_MS).toISOString().slice(0, 10),
    to: new Date(now).toISOString(),
  };
}

async function fetchPRs() {
  const { fromDate } = trailingYear();
  const grouped = new Map();
  let totalPRs = 0;

  try {
    const q = `author:${USERNAME} type:pr is:merged merged:>=${fromDate}`;
    let page = 1;
    const seenRepos = new Map();

    // Cap pagination so unauthenticated runs (60 req/h) don't get throttled.
    while (page <= 2) {
      const res = await fetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100&page=${page}&sort=updated&order=desc`,
        { headers },
      );
      if (res.status === 403 || res.status === 429) {
        console.warn('[github] PR search rate-limited, keeping what we have.');
        break;
      }
      if (!res.ok) {
        console.warn(`[github] PR search failed: ${res.status}`);
        break;
      }
      const json = await res.json();
      const items = json.items ?? [];
      if (items.length === 0) break;

      for (const item of items) {
        let repo = seenRepos.get(item.repository_url);
        if (!repo) {
          if (seenRepos.size >= 20) continue;
          const repoRes = await fetch(item.repository_url, { headers });
          if (!repoRes.ok) continue;
          const repoJson = await repoRes.json();
          const owner = (repoJson.full_name ?? '').split('/')[0] ?? '';
          if (owner.toLowerCase() === USERNAME.toLowerCase()) continue;
          if ((repoJson.stargazers_count ?? 0) < MIN_STARS) continue;
          repo = {
            name: repoJson.name,
            full_name: repoJson.full_name,
            url: repoJson.html_url,
            stargazerCount: repoJson.stargazers_count ?? 0,
          };
          seenRepos.set(item.repository_url, repo);
        }
        const mergedAt = item.closed_at ?? item.updated_at;
        const pr = {
          id: item.id,
          number: item.number,
          title: item.title,
          state: 'merged',
          merged_at: mergedAt,
          created_at: item.created_at,
          updated_at: item.updated_at,
          url: item.html_url,
          repository: repo,
        };
        const list = grouped.get(repo.full_name) ?? [];
        list.push(pr);
        grouped.set(repo.full_name, list);
        totalPRs += 1;
      }
      if (items.length < 100) break;
      page += 1;
    }
  } catch (err) {
    console.warn('[github] PR fetch error:', String(err));
  }

  const groups = [...grouped.values()].map((prs) => {
    const newestFirst = [...prs].sort((a, b) => Date.parse(b.merged_at) - Date.parse(a.merged_at));
    return {
      repository: newestFirst[0].repository,
      prs: newestFirst,
      mergedCount: newestFirst.length,
      lastMergedAt: newestFirst[0].merged_at,
    };
  });
  groups.sort(
    (a, b) =>
      Date.parse(b.lastMergedAt) - Date.parse(a.lastMergedAt) ||
      b.repository.stargazerCount - a.repository.stargazerCount,
  );

  await enrichWithDiffStats(groups);

  return { grouped: groups, totalPRs, fetchedAt: new Date().toISOString() };
}

/**
 * Attach per-PR diff stats (additions / deletions / changed_files) used by the
 * Open Source Contributions card. One REST call per PR; capped so unauthenticated
 * runs stay inside the rate limit. On failure the fields stay undefined and the
 * UI simply omits them.
 */
async function enrichWithDiffStats(groups, cap = 30) {
  let fetched = 0;
  for (const group of groups) {
    for (const pr of group.prs) {
      if (fetched >= cap) return;
      fetched += 1;
      try {
        const res = await fetch(
          `https://api.github.com/repos/${group.repository.full_name}/pulls/${pr.number}`,
          { headers },
        );
        if (!res.ok) continue;
        const json = await res.json();
        pr.additions = json.additions ?? 0;
        pr.deletions = json.deletions ?? 0;
        pr.changedFiles = json.changed_files ?? 0;
      } catch {
        // keep undefined — the card renders without the stat
      }
    }
  }
}

async function fetchActivityGraphQL() {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount contributionLevel }
            }
          }
        }
      }
    }`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username: USERNAME } }),
  });
  if (!res.ok) throw new Error(`GraphQL ${res.status}`);
  const json = await res.json();
  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error('empty calendar');

  const levelMap = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  const weeks = calendar.weeks.map((w) => ({
    days: w.contributionDays.map((d) => ({
      date: d.date,
      contributionCount: d.contributionCount,
      intensity: levelMap[d.contributionLevel] ?? 0,
    })),
  }));
  const allDays = weeks.flatMap((w) => w.days);
  let longestStreak = 0;
  let current = 0;
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      current += 1;
      longestStreak = Math.max(longestStreak, current);
    } else current = 0;
  }
  return {
    totalContributions: calendar.totalContributions,
    weeks,
    longestStreak,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchActivityPublic() {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`);
  if (!res.ok) throw new Error(`contributions-api ${res.status}`);
  const json = await res.json();
  const contributions = json.contributions ?? [];
  if (contributions.length === 0) throw new Error('empty contributions');
  const total =
    typeof json.total === 'number'
      ? json.total
      : (json.total?.lastYear ?? contributions.reduce((s, d) => s + (d.count ?? 0), 0));
  const days = contributions.map((d) => ({
    date: d.date,
    contributionCount: d.count ?? 0,
    intensity: Math.max(0, Math.min(4, d.level ?? 0)),
  }));
  let longestStreak = 0;
  let current = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      current += 1;
      longestStreak = Math.max(longestStreak, current);
    } else current = 0;
  }
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push({ days: days.slice(i, i + 7) });
  return { totalContributions: total, weeks, longestStreak, fetchedAt: new Date().toISOString() };
}

async function fetchActivity() {
  if (TOKEN) {
    try {
      return await fetchActivityGraphQL();
    } catch (err) {
      console.warn('[github] GraphQL activity failed, trying public API:', String(err));
    }
  }
  try {
    return await fetchActivityPublic();
  } catch (err) {
    console.warn('[github] activity fetch error:', String(err));
    return null;
  }
}

let previous = null;
if (existsSync(outPath)) {
  try {
    previous = JSON.parse(readFileSync(outPath, 'utf8'));
  } catch {
    previous = null;
  }
}

const [prs, activity] = await Promise.all([fetchPRs(), fetchActivity()]);

const snapshot = {
  username: USERNAME,
  prs,
  // Keep the previous heatmap when offline so the section never flashes empty.
  activity: activity ?? previous?.activity ?? null,
  generatedAt: new Date().toISOString(),
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');
console.log(
  `[github] snapshot written: ${prs.totalPRs} PRs in ${prs.grouped.length} repos, ` +
    (snapshot.activity ? `${snapshot.activity.totalContributions} contributions` : 'no activity'),
);
