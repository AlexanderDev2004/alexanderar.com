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
          class="flex items-center gap-3 w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <iconify-icon icon={category.icon} width="24" height="24" class="text-gray-700 dark:text-gray-300"></iconify-icon>
          <div class="flex-1 text-left">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h3>
          </div>
          <span class="text-gray-600 dark:text-gray-400 text-sm">
            ({category.items.length} items)
          </span>
          <iconify-icon
            icon="mdi:chevron-down"
            width="24"
            height="24"
            class="text-gray-600 dark:text-gray-400 transition-transform duration-300 {expandedCategories[
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
          class="mt-3 space-y-3 pl-2 sm:pl-3 border-l-2 border-gray-300 dark:border-gray-600 expand-reveal"
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
                  class="reveal h-full flex flex-col p-4 sm:p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-blue-500/20 transition-all duration-200"
                >
                  <!-- Preview Image -->
                  {#if item.preview}
                    <div class="relative w-full h-40 sm:h-44 md:h-48 mb-3 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                      <img
                        src={item.preview}
                        alt={item.title}
                        class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        loading="lazy"
                        on:error={handleImageError}
                      />
                      <div class="hidden absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        <iconify-icon icon="mdi:image-off" width="32" height="32" class="text-gray-400"></iconify-icon>
                      </div>
                    </div>
                  {/if}

                  <!-- Title -->
                  <h4 class="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>

                  <!-- Description -->
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                    {item.description}
                  </p>

                  <!-- Tags -->
                  {#if item.tags && item.tags.length > 0}
                    <div class="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {#each item.tags as tag}
                        <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium">
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
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
