<script lang="ts">
  type BlogListItem = {
    title: string;
    date: string;
    description: string;
    tags: string[];
    slug: string;
  };

  let items: BlogListItem[] = [];

  export { items as items };
</script>

<div class="space-y-4">
  {#each items.slice(0, 2) as blog (blog.slug)}
    <div class="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 dark:text-blue-400 line-clamp-2">
            {blog.title}
          </h3>
          <div class="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <iconify-icon icon="mdi:calendar" width="16" height="16"></iconify-icon>
            <span>{blog.date}</span>
          </div>
        </div>
      </div>

      <div class="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
        <p class="text-sm leading-relaxed line-clamp-3">{blog.description}</p>

        {#if blog.tags && blog.tags.length > 0}
          <div class="flex flex-wrap gap-2 pt-2">
            {#each blog.tags as tag}
              <span class="text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                #{tag}
              </span>
            {/each}
          </div>
        {/if}

        <a
          href="/blogs/{blog.slug}"
          class="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors"
        >
          Read
          <iconify-icon icon="mdi:arrow-right" width="16" height="16"></iconify-icon>
        </a>
      </div>
    </div>
  {/each}

  {#if items.length > 2}
    <div class="flex justify-center pt-2">
      <a
        href="/all-blogs"
        class="inline-flex items-center gap-2 px-6 py-3 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
      >
        – SEE MORE
      </a>
    </div>
  {/if}
</div>
