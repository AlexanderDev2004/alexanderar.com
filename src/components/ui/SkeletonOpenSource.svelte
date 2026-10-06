<script>
  import Skeleton from "./Skeleton.svelte";
  /**
   * SkeletonOpenSource — placeholder daftar merged PR.
   * Meniru struktur kartu repo agar tinggi mendekati konten asli.
   */
  export let count = 3;
  export let className = "";
</script>

<div class="space-y-3 {className}" role="status" aria-label="Memuat open source…">
  <Skeleton className="h-4 w-3/4 rounded-full opacity-70" />
  <div class="space-y-2">
    {#each Array(count) as _, i}
      <div class="surface-item rounded-lg p-3 sm:p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md opacity-70" />
              <Skeleton className="h-5 w-20 rounded-md opacity-60" />
            </div>
            <Skeleton className="h-3 w-40 rounded-full opacity-60" />
          </div>
          <Skeleton className="h-4 w-4 shrink-0 rounded-full opacity-60" />
        </div>
      </div>
    {/each}
  </div>
  <span class="sr-only">Memuat open source…</span>
</div>
