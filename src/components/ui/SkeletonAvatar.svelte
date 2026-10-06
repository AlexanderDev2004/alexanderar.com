<script>
  import Skeleton from "./Skeleton.svelte";
  /** Avatar: lingkaran + 2 baris teks di sampingnya. */
  export let className = "";
</script>

<div class="flex items-center gap-3 {className}" aria-hidden="true">
  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
  <div class="flex-1 space-y-2">
    <Skeleton className="h-3 w-2/5 rounded-full" />
    <Skeleton className="h-3 w-3/5 rounded-full opacity-70" />
  </div>
</div>
