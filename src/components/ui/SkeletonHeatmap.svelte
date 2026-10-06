<script>
  import Skeleton from "./Skeleton.svelte";
  /**
   * SkeletonHeatmap — placeholder GitActivity.
   * Ukurannya disamakan dengan tampilan asli supaya tidak layout-shift.
   */
  export let className = "";
</script>

<div class="space-y-3 {className}" role="status" aria-label="Memuat aktivitas GitHub…">
  <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
    <div class="flex items-baseline gap-2 sm:gap-3">
      <Skeleton className="h-10 w-20 rounded-md sm:h-12 sm:w-28" />
      <Skeleton className="h-3 w-44 rounded-full opacity-70 sm:w-56" />
    </div>
    <Skeleton className="h-3 w-32 rounded-full opacity-60" />
  </div>

  <div class="flex gap-[3px] pt-1" aria-hidden="true">
    {#each Array(26) as _, wi}
      <div class="flex flex-1 flex-col gap-[3px]">
        {#each Array(7) as __, di}
          <Skeleton className="aspect-square w-full rounded-[2px] opacity-60" />
        {/each}
      </div>
    {/each}
  </div>

  <div class="flex items-center justify-between gap-3 pt-1">
    <Skeleton className="h-3 w-36 rounded-full opacity-60" />
    <Skeleton className="h-3 w-24 rounded-full opacity-60" />
  </div>
  <span class="sr-only">Memuat aktivitas GitHub…</span>
</div>
