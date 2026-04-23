<script lang="ts">
  import type { BookmarkCategory, BookmarkItem } from '../data/bookmarks';

  export let categories: BookmarkCategory[] = [];

  let expandedCategories: Record<string, boolean> = {};

  function toggleCategory(id: string) {
    expandedCategories[id] = !expandedCategories[id];
  }

  function openBookmark(url: string) {
    if (url !== '#') {
      window.open(url, '_blank');
    }
  }

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img && img.nextElementSibling) {
      img.style.display = 'none';
      (img.nextElementSibling as HTMLElement).style.display = 'flex';
    }
  }
</script>

<div class="space-y-4">
  {#each categories as category, categoryIndex}
    <div class="reveal" style="--reveal-delay: {categoryIndex * 60}ms">
      <!-- Category Header -->
      <button
        on:click={() => toggleCategory(category.id)}
        class="w-full group pressable"
      >
        <div
          class="surface-item flex items-center gap-3 w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg transition-colors duration-200"
        >
          <iconify-icon icon={category.icon} width="24" height="24" class="primary-text"></iconify-icon>
          <div class="flex-1 text-left">
            <h3 class="text-lg sm:text-xl font-bold primary-text">
              {category.name}
            </h3>
          </div>
          <span class="muted-text text-sm">
            ({category.items.length} items)
          </span>
          <iconify-icon
            icon="mdi:chevron-down"
            width="24"
            height="24"
            class="muted-text transition-transform duration-300 {expandedCategories[
              category.id
            ]
              ? 'rotate-180'
              : ''}"
          ></iconify-icon>
        </div>
      </button>

      <!-- Category Content -->
      {#if expandedCategories[category.id]}
        <div
          class="mt-3 space-y-3 pl-2 sm:pl-3 expand-reveal"
          style="border-left: 2px solid var(--surface-border);"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {#each category.items as item, itemIndex}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                on:click={() => openBookmark(item.url)}
                class="group cursor-pointer pressable"
                style="--reveal-delay: {(categoryIndex + itemIndex) * 30}ms"
              >
                <div
                  class="surface-item reveal h-full flex flex-col p-4 sm:p-5 rounded-lg transition-all duration-200"
                >
                  <!-- Preview Image -->
                  {#if item.preview}
                    <div class="relative w-full h-40 sm:h-44 md:h-48 mb-3 rounded overflow-hidden" style="background: var(--surface);">
                      <img
                        src={item.preview}
                        alt={item.title}
                        class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        loading="lazy"
                        on:error={handleImageError}
                      />
                      <div class="absolute inset-0 items-center justify-center" style="display: none; background: var(--surface);">
                        <iconify-icon icon="mdi:image-off" width="32" height="32" class="muted-text"></iconify-icon>
                      </div>
                    </div>
                  {/if}

                  <!-- Title -->
                  <h4 class="font-semibold text-sm sm:text-base accent-link mb-2 line-clamp-2 transition-colors">
                    {item.title}
                  </h4>

                  <!-- Description -->
                  <p class="text-xs sm:text-sm muted-text line-clamp-2 mb-3 flex-1">
                    {item.description}
                  </p>

                  <!-- Tags -->
                  {#if item.tags && item.tags.length > 0}
                    <div class="flex flex-wrap gap-1.5 pt-2" style="border-top: 1px solid var(--surface-border);">
                      {#each item.tags as tag}
                        <span class="pill-chip text-xs px-2 py-1 font-medium">
                          {tag}
                        </span>
                      {/each}
                    </div>
                  {/if}
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  :global(.rotate-180) {
    transform: rotate(180deg);
  }

  :global(.line-clamp-2) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
