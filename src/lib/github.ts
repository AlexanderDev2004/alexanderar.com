// Central config + types for the elianiva-style dynamic GitHub sections.
//
// elianiva.com loads these at request time via TanStack server functions
// (see `src/features/github/lib/github.service.ts` upstream):
//   - merged PRs in other people's repos, trailing 365 days, min stars
//   - contribution calendar (total + weeks + longest streak) for the heatmap
//
// This repo is `output: 'static'`, so the equivalent is:
//   - build-time fetch -> `src/data/github.json` (via `scripts/fetch-github.mjs`)
//   - Svelte islands render the build-time data instantly, then refresh
//     client-side from the public GitHub API with a 24h localStorage cache.

export const GITHUB_USERNAME = 'AlexanderDev2004';

/** Below this a project is too small to tell a visitor anything (elianiva uses 100).
 *  Kept at 0 here because most collaboration repos at this stage are small —
 *  what matters is that other maintainers merged the work. */
export const MIN_STARS = 0;

export const GITHUB_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export interface GitHubRepoRef {
  name: string;
  full_name: string;
  url: string;
  stargazerCount: number;
}

export interface GitHubPR {
  id: number | string;
  number: number;
  title: string;
  state: 'merged';
  merged_at: string;
  created_at: string;
  updated_at: string;
  url: string;
  repository: GitHubRepoRef;
}

export interface RepositoryPRGroup {
  repository: GitHubRepoRef;
  prs: GitHubPR[];
  mergedCount: number;
  lastMergedAt: string;
}

export interface GitHubPRData {
  grouped: RepositoryPRGroup[];
  totalPRs: number;
  fetchedAt: string;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  /** 0-4 intensity, same scale as elianiva's HeatmapGrid */
  intensity: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface GitHubActivityData {
  totalContributions: number;
  weeks: ContributionWeek[];
  longestStreak: number;
  fetchedAt: string;
}

export interface GitHubSnapshot {
  username: string;
  prs: GitHubPRData;
  activity: GitHubActivityData | null;
}

export const EMPTY_PRS: GitHubPRData = {
  grouped: [],
  totalPRs: 0,
  fetchedAt: new Date(0).toISOString(),
};

const CACHE_KEYS = {
  prs: (username: string) => `github-prs:v1:${username}`,
  activity: (username: string) => `github-activity:v1:${username}`,
} as const;

function canUseStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

interface CachedEnvelope<T> {
  savedAt: number;
  data: T;
}

export function readCache<T>(key: string, ttlMs = GITHUB_CACHE_TTL_MS): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedEnvelope<T>;
    if (Date.now() - parsed.savedAt > ttlMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  if (!canUseStorage()) return;
  try {
    const envelope: CachedEnvelope<T> = { savedAt: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // storage full / private mode — ignore, build-time data is still shown
  }
}

function authHeaders(): Record<string, string> {
  // Public data needs no token. A token (Vite / Astro public env) only raises
  // the rate limit from 60 -> 5000 req/hour.
  // Set PUBLIC_GITHUB_TOKEN in production if you hit rate limits.
  const token =
    (import.meta as unknown as { env?: Record<string, string> }).env?.PUBLIC_GITHUB_TOKEN;
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

/** Trailing 365-day window, same anchoring as elianiva's `trailingYear()`. */
export function trailingYear(now = Date.now()): { from: string; to: string } {
  const DAY_MS = 86_400_000;
  return {
    from: new Date(now - 365 * DAY_MS).toISOString().slice(0, 10),
    to: new Date(now).toISOString().slice(0, 10),
  };
}

/**
 * Client-side refresh of merged PRs via the public REST search API.
 * Returns `null` on rate-limit / network failure so callers keep build-time data.
 */
export async function fetchPRsClient(
  username: string = GITHUB_USERNAME,
): Promise<GitHubPRData | null> {
  const cached = readCache<GitHubPRData>(CACHE_KEYS.prs(username));
  if (cached) return cached;

  try {
    const { from } = trailingYear();
    const q = `author:${username} type:pr is:merged merged:>=${from}`;
    const searchRes = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100&sort=updated&order=desc`,
      { headers: { Accept: 'application/vnd.github+json', ...authHeaders() } },
    );
    if (!searchRes.ok) return null;
    const searchJson = (await searchRes.json()) as {
      items?: Array<{
        id: number;
        number: number;
        title: string;
        updated_at: string;
        created_at: string;
        closed_at?: string | null;
        html_url: string;
        repository_url: string;
      }>;
    };
    const items = searchJson.items ?? [];
    if (items.length === 0) return null;

    // Enrich with repo owner + stars (needed for the "not mine + min stars" rule).
    // Cap at 20 repos to stay inside the unauthenticated rate limit.
    const repoCache = new Map<string, GitHubRepoRef>();
    const groups = new Map<string, GitHubPR[]>();

    for (const item of items.slice(0, 100)) {
      let repo = repoCache.get(item.repository_url);
      if (!repo) {
        if (repoCache.size >= 20) continue;
        const repoRes = await fetch(item.repository_url, {
          headers: { Accept: 'application/vnd.github+json', ...authHeaders() },
        });
        if (!repoRes.ok) continue;
        const repoJson = (await repoRes.json()) as {
          name: string;
          full_name: string;
          html_url: string;
          stargazers_count: number;
          owner?: { login?: string };
        };
        const owner = repoJson.full_name.split('/')[0] ?? '';
        if (owner.toLowerCase() === username.toLowerCase()) continue;
        if ((repoJson.stargazers_count ?? 0) < MIN_STARS) continue;
        repo = {
          name: repoJson.name,
          full_name: repoJson.full_name,
          url: repoJson.html_url,
          stargazerCount: repoJson.stargazers_count ?? 0,
        };
        repoCache.set(item.repository_url, repo);
      }
      const mergedAt = item.closed_at ?? item.updated_at;
      const pr: GitHubPR = {
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
      const list = groups.get(repo.full_name) ?? [];
      list.push(pr);
      groups.set(repo.full_name, list);
    }

    const grouped: RepositoryPRGroup[] = [...groups.values()].map((prs) => {
      const newestFirst = [...prs].sort(
        (a, b) => Date.parse(b.merged_at) - Date.parse(a.merged_at),
      );
      return {
        repository: newestFirst[0].repository,
        prs: newestFirst,
        mergedCount: newestFirst.length,
        lastMergedAt: newestFirst[0].merged_at,
      };
    });
    grouped.sort(
      (a, b) =>
        Date.parse(b.lastMergedAt) - Date.parse(a.lastMergedAt) ||
        b.repository.stargazerCount - a.repository.stargazerCount,
    );

    const data: GitHubPRData = {
      grouped,
      totalPRs: grouped.reduce((sum, g) => sum + g.mergedCount, 0),
      fetchedAt: new Date().toISOString(),
    };
    writeCache(CACHE_KEYS.prs(username), data);
    return data;
  } catch {
    return null;
  }
}

interface JogruberResponse {
  total?: { lastYear?: number } | number;
  contributions?: Array<{ date: string; count: number; level: number }>;
}

/**
 * Client-side refresh of the contribution calendar.
 * Uses the public github-contributions-api (no token needed), same numbers
 * elianiva reads from GraphQL `contributionCalendar`.
 */
export async function fetchActivityClient(
  username: string = GITHUB_USERNAME,
): Promise<GitHubActivityData | null> {
  const cached = readCache<GitHubActivityData>(CACHE_KEYS.activity(username));
  if (cached) return cached;

  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    if (!res.ok) return null;
    const json = (await res.json()) as JogruberResponse;
    const contributions = json.contributions ?? [];
    if (contributions.length === 0) return null;

    const total =
      typeof json.total === 'number' ? json.total : (json.total?.lastYear ?? contributions.reduce((s, d) => s + d.count, 0));

    const days: ContributionDay[] = contributions.map((d) => ({
      date: d.date,
      contributionCount: d.count,
      intensity: Math.max(0, Math.min(4, d.level ?? 0)),
    }));

    let longestStreak = 0;
    let current = 0;
    for (const day of days) {
      if (day.contributionCount > 0) {
        current += 1;
        longestStreak = Math.max(longestStreak, current);
      } else {
        current = 0;
      }
    }

    const weeks: ContributionWeek[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ days: days.slice(i, i + 7) });
    }

    const data: GitHubActivityData = {
      totalContributions: total,
      weeks,
      longestStreak,
      fetchedAt: new Date().toISOString(),
    };
    writeCache(CACHE_KEYS.activity(username), data);
    return data;
  } catch {
    return null;
  }
}
