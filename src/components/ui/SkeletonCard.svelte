<script>
  import Skeleton from "./Skeleton.svelte";
  /** Card: image 16:9 + title + 2 baris teks + footer. */
  export let className = "";
</script>

<div
  class="surface-item overflow-hidden rounded-lg {className}"
  aria-hidden="true"
  aria-label="Memuat konten…"
  role="status"
>
  <Skeleton className="h-40 w-full rounded-none sm:h-44 md:h-48" />
  <div class="space-y-3 p-4 sm:p-5">
    <Skeleton className="h-4 w-3/4" />
    <div class="space-y-2">
      <Skeleton className="h-3 w-full opacity-80" />
      <Skeleton className="h-3 w-5/6 opacity-70" />
    </div>
    <div class="flex gap-1.5 pt-1">
      <Skeleton className="h-6 w-16 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-md opacity-70" />
      <Skeleton className="h-6 w-10 rounded-md opacity-60" />
    </div>
  </div>
</div>
