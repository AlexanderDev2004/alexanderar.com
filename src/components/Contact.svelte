<script lang="ts">
  import type { ContactItem } from '../data/contact';

  let items: ContactItem[] = [];

  export { items as items };
</script>

<div class="flex flex-wrap gap-3">
  {#each items as item, index (item.id)}
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      class="surface-item inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium primary-text reveal pressable"
      style={`--reveal-delay: ${index}`}
    >
      <iconify-icon icon={item.icon} width="18" height="18"></iconify-icon>
      <span>{item.label}</span>
    </a>
  {/each}
</div>
