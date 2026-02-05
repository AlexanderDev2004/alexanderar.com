<script lang="ts">
  import type { ContactItem } from '../data/contact';

  let items: ContactItem[] = [];

  export { items as items };
</script>

<div class="flex flex-wrap gap-3">
  {#each items as item (item.id)}
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 px-4 py-2 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
    >
      <iconify-icon icon={item.icon} width="18" height="18"></iconify-icon>
      <span>{item.label}</span>
    </a>
  {/each}
</div>
