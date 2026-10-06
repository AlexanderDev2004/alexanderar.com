<script>
  import Skeleton from "./Skeleton.svelte";
  /** Form: label + input berulang + tombol submit. */
  export let rows = 3;
  export let className = "";
</script>

<div class="space-y-4 {className}" aria-hidden="true" role="status" aria-label="Memuat formulir…">
  {#each Array(rows) as _, i}
    <div class="space-y-2">
      <Skeleton className="h-3 w-24 rounded-full opacity-80" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  {/each}
  <Skeleton className="h-10 w-28 rounded-full opacity-90" />
</div>
