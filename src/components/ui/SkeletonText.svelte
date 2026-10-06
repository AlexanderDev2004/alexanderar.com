<script>
  import Skeleton from "./Skeleton.svelte";
  /** Text: 3 baris paragraf. `lines` bisa diatur. */
  export let lines = 3;
  export let className = "";
  $: widths = ["w-full", "w-11/12", "w-4/6", "w-5/6", "w-3/6"];
</script>

<div class="space-y-2 {className}" aria-hidden="true">
  {#each Array(lines) as _, i}
    <Skeleton className="h-3 {widths[i % widths.length]} rounded-full {i > 0 ? 'opacity-70' : ''}" />
  {/each}
</div>
