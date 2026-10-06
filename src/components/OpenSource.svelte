<script>
  import { onMount } from 'svelte';
  import { fetchPRsClient } from '../lib/github';
  import SkeletonOpenSource from './ui/SkeletonOpenSource.svelte';

  export let grouped = [];
  export let totalPRs = 0;
  export let username = 'AlexanderDev2004';

  let liveGrouped = grouped;
  let liveTotal = totalPRs;
  let refreshing = false;
  let expandedRepo = '';
  // Skeleton hanya saat daftar kosong (tidak ada build-time data).
  let loading = liveGrouped.length === 0;

  $: projects = liveGrouped.length;

  onMount(async () => {
    // Build-time data renders instantly (SEO + no layout shift).
    // Then refresh client-side so the section stays "dynamically generated"
    // like elianiva.com without needing SSR.
    // Skeleton hanya tampil kalau awalnya kosong — kalau ada data,
    // refresh berjalan diam-diam tanpa menukar UI (anti kedip).
    if (liveGrouped.length > 0) {
      try {
        refreshing = true;
        const fresh = await fetchPRsClient(username);
        if (fresh && fresh.totalPRs > 0) {
          liveGrouped = fresh.grouped;
          liveTotal = fresh.totalPRs;
        }
      } finally {
        refreshing = false;
      }
      return;
    }
    try {
      loading = true;
      refreshing = true;
      const fresh = await fetchPRsClient(username);
      if (fresh && fresh.totalPRs > 0) {
        // Only swap when the fresh payload is non-empty to avoid
        // flashing an empty state on rate-limit.
        liveGrouped = fresh.grouped;
        liveTotal = fresh.totalPRs;
      }
    } finally {
      loading = false;
      refreshing = false;
    }
  });

  function toggleRepo(fullName) {
    expandedRepo = expandedRepo === fullName ? '' : fullName;
  }

  function formatDate(value) {
    try {
      return new Date(value).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return value;
    }
  }
</script>

<div class="space-y-3">
  <p class="text-xs sm:text-sm muted-text leading-relaxed">
    Merged pull requests in other people&rsquo;s projects over the last year, most recent first.
    {#if refreshing}<span class="opacity-60">· refreshing…</span>{/if}
  </p>

  {#if liveGrouped.length > 0}
    <div class="space-y-2">
      {#each liveGrouped as group (group.repository.full_name)}
        <div class="surface-item rounded-lg overflow-hidden reveal">
          <button
            type="button"
            class="w-full text-left p-3 sm:p-4 flex justify-between items-start gap-3 pressable"
            onclick={() => toggleRepo(group.repository.full_name)}
            aria-expanded={expandedRepo === group.repository.full_name}
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2 flex-wrap">
                <a
                  href={group.repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm sm:text-base font-bold accent-link truncate"
                  onclick={(e) => e.stopPropagation()}
                >
                  {group.repository.full_name}
                </a>
                <span class="pill-chip text-[11px] font-semibold px-2 py-0.5">
                  ★ {group.repository.stargazerCount}
                </span>
                <span class="pill-chip text-[11px] font-semibold px-2 py-0.5">
                  {group.mergedCount} merged
                </span>
              </div>
              <p class="text-[11px] sm:text-xs muted-text mt-1">
                last merged · {formatDate(group.lastMergedAt)}
              </p>
            </div>
            <svg
              class="w-4 h-4 mt-1 shrink-0 transition-transform duration-300 {expandedRepo === group.repository.full_name ? 'rotate-180' : ''}"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {#if expandedRepo === group.repository.full_name}
            <ul class="px-3 sm:px-4 pb-3 space-y-2 expand-reveal" style="border-top: 1px solid var(--surface-border);">
              {#each group.prs as pr (pr.id)}
                <li class="pt-2">
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group/pr flex items-start gap-2 text-xs sm:text-sm primary-text hover:underline"
                  >
                    <iconify-icon icon="mdi:source-pull" width="16" height="16" class="mt-0.5 shrink-0"></iconify-icon>
                    <span class="flex-1 min-w-0">
                      <span class="font-medium">#{pr.number} {pr.title}</span>
                      <span class="block muted-text text-[11px] sm:text-xs mt-0.5">
                        merged · {formatDate(pr.merged_at)}
                      </span>
                    </span>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
    <p class="text-[11px] sm:text-xs muted-text font-mono pt-1">
      {liveTotal} merged pull request{liveTotal === 1 ? '' : 's'} across {projects} project{projects === 1 ? '' : 's'}
      · <a href={`https://github.com/pulls?q=author%3A${username}+is%3Amerged`} target="_blank" rel="noopener noreferrer" class="accent-link">view on GitHub</a>
    </p>
  {:else if loading}
    <SkeletonOpenSource count={3} />
  {:else}
    <div class="text-center py-8 surface-item rounded-lg">
      <p class="muted-text text-sm">No merged pull requests from the last year to show.</p>
      <p class="muted-text text-xs mt-1 opacity-70">Data refreshes automatically every 24h.</p>
    </div>
  {/if}
</div>
