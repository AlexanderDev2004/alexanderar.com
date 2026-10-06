<script>
  import { onMount } from 'svelte';
  import { fetchActivityClient } from '../lib/github';
  import SkeletonHeatmap from './ui/SkeletonHeatmap.svelte';

  export let initial = null;
  export let username = 'AlexanderDev2004';

  let data = initial;
  let refreshing = false;
  // Skeleton hanya saat benar-benar tidak ada data (initial null).
  // Kalau build-time data ada, langsung render (SEO + tanpa layout shift),
  // refresh client-side berjalan diam-diam di belakang.
  let loading = data == null;

  // Compact view shows ~6 months on small screens so nothing overflows,
  // full 53-week grid on sm+ — same idea as elianiva's HeatmapGrid.
  const COMPACT_WEEKS = 26;

  $: weeks = data?.weeks ?? [];
  $: compactWeeks = weeks.slice(-COMPACT_WEEKS);
  $: compactTotal = compactWeeks
    .flatMap((w) => w.days)
    .reduce((sum, d) => sum + (d.contributionCount ?? 0), 0);

  onMount(async () => {
    // Kalau sudah ada build-time data, cukup refresh diam-diam.
    // Kalau tidak ada data sama sekali, tampilkan skeleton sampai fetch selesai.
    if (data) {
      try {
        refreshing = true;
        const fresh = await fetchActivityClient(username);
        if (fresh && fresh.totalContributions > 0) data = fresh;
      } finally {
        refreshing = false;
      }
      return;
    }
    try {
      loading = true;
      refreshing = true;
      const fresh = await fetchActivityClient(username);
      if (fresh && fresh.totalContributions > 0) data = fresh;
    } finally {
      loading = false;
      refreshing = false;
    }
  });

  function formatNumber(n) {
    return (n ?? 0).toLocaleString('en-US');
  }

  function cellTitle(day) {
    return `${day.date} · ${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`;
  }
</script>

<div class="space-y-3">
  {#if data}
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <div class="flex items-baseline gap-2 sm:gap-3">
        <span class="sm:hidden text-3xl font-mono font-bold accent-text tabular-nums">{formatNumber(compactTotal)}</span>
        <span class="hidden sm:inline text-4xl md:text-5xl font-mono font-bold accent-text tabular-nums">{formatNumber(data.totalContributions)}</span>
        <span class="text-[11px] sm:text-xs md:text-sm font-mono muted-text">
          <span class="sm:hidden">contributions · past 6 months</span>
          <span class="hidden sm:inline">contributions · past 365 days</span>
          {#if refreshing}<span class="opacity-60"> · refreshing…</span>{/if}
        </span>
      </div>
      <p class="text-[11px] sm:text-xs md:text-sm font-mono muted-text">
        longest streak · {data.longestStreak}d
      </p>
    </div>

    <!-- Mobile: recent ~6 months -->
    <div class="flex gap-[3px] sm:hidden" role="img" aria-label={`GitHub contributions, past 6 months, total ${compactTotal}`}>
      {#each compactWeeks as week, wi (wi)}
        <div class="flex flex-1 flex-col gap-[3px]">
          {#each week.days as day (day.date)}
            <div
              class="aspect-square rounded-[2px] heat-cell heat-{day.intensity}"
              title={cellTitle(day)}
            ></div>
          {/each}
        </div>
      {/each}
    </div>

    <!-- Desktop: full year -->
    <div class="hidden sm:flex gap-[3px]" role="img" aria-label={`GitHub contributions, past year, total ${data.totalContributions}`}>
      {#each weeks as week, wi (wi)}
        <div class="flex flex-1 flex-col gap-[3px]">
          {#each week.days as day (day.date)}
            <div
              class="aspect-square rounded-[2px] heat-cell heat-{day.intensity}"
              title={cellTitle(day)}
            ></div>
          {/each}
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-between gap-3 pt-1">
      <p class="text-[11px] sm:text-xs muted-text">
        Updated {data.fetchedAt ? new Date(data.fetchedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'recently'}
      </p>
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        class="accent-link text-[11px] sm:text-xs font-medium inline-flex items-center gap-1"
      >
        @{username}
        <iconify-icon icon="mdi:open-in-new" width="14" height="14"></iconify-icon>
      </a>
    </div>
  {:else if loading}
    <SkeletonHeatmap />
  {:else}
    <div class="pt-1 pb-2">
      <div class="flex items-baseline gap-3">
        <span class="text-4xl font-mono font-bold opacity-20">0</span>
        <span class="text-xs font-mono muted-text opacity-60">contributions · past 365 days</span>
      </div>
      <div class="flex gap-[3px] pt-4" aria-hidden="true">
        {#each Array(26) as _, wi}
          <div class="flex flex-1 flex-col gap-[3px]">
            {#each Array(7) as __, di}
              <div class="aspect-square rounded-[2px] heat-cell heat-0 opacity-40"></div>
            {/each}
          </div>
        {/each}
      </div>
      <p class="text-xs muted-text pt-2">Contribution data unavailable — check back after the next refresh.</p>
    </div>
  {/if}
</div>

<style>
  .accent-text {
    color: var(--accent-strong);
  }
  .heat-cell {
    min-width: 0;
    transition: transform 0.12s ease;
  }
  .heat-cell:hover {
    transform: scale(1.25);
  }
  .heat-0 { background: color-mix(in srgb, var(--surface-border-soft) 55%, transparent); }
  .heat-1 { background: color-mix(in srgb, var(--accent) 32%, transparent); }
  .heat-2 { background: color-mix(in srgb, var(--accent) 58%, transparent); }
  .heat-3 { background: color-mix(in srgb, var(--accent-strong) 78%, transparent); }
  .heat-4 { background: var(--accent-strong); }
</style>
