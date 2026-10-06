<script>
  import Skeleton from "./Skeleton.svelte";
  /** Table: header + N baris, tiap baris 4 kolom. */
  export let rows = 5;
  export let className = "";
</script>

<div class="surface-item overflow-hidden rounded-lg {className}" aria-hidden="true" role="status" aria-label="Memuat tabel…">
  <div class="flex gap-2 border-b p-3 sm:p-4" style="border-color: var(--surface-border-soft);">
    <Skeleton className="h-3 w-1/4 rounded-full" />
    <Skeleton className="h-3 w-1/4 rounded-full opacity-70" />
    <Skeleton className="h-3 w-1/4 rounded-full opacity-70" />
    <Skeleton className="h-3 w-1/4 rounded-full opacity-60" />
  </div>
  <div class="space-y-0">
    {#each Array(rows) as _, i}
      <div class="flex items-center gap-2 p-3 sm:p-4" style="border-top: {i === 0 ? 'none' : '1px solid var(--surface-border-soft)'};">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full opacity-80" />
        <Skeleton className="h-3 flex-1 rounded-full opacity-70" />
        <Skeleton className="hidden h-3 w-24 rounded-full opacity-60 sm:block" />
        <Skeleton className="h-6 w-16 rounded-md opacity-60" />
      </div>
    {/each}
  </div>
</div>
