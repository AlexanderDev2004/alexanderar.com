<script lang="ts">
  type BlogListItem = {
    title: string;
    date: string;
    description: string;
    tags: string[];
    slug: string;
  };

  let items: BlogListItem[] = [];
  let searchQuery: string = '';

  export { items as items };

  const normalize = (value: string) => value.toLowerCase().trim();

  $: filteredItems = items.filter((blog) => {
    const query = normalize(searchQuery);
    if (!query) return true;

    const tags = (blog.tags ?? []).map(normalize);

    if (query.startsWith('#')) {
      const tagQuery = normalize(query.replace(/^#+/, ''));
      return tagQuery.length > 0 && tags.some((tag) => tag.startsWith(tagQuery));
    }

    const title = normalize(blog.title ?? '');
    const description = normalize(blog.description ?? '');

    return title.includes(query) || description.includes(query);
  });
</script>

<div class="space-y-6">
  <!-- Search Bar -->
  <div class="mb-6">
    <input
      type="text"
      placeholder="Find post...(start with # to find tags)"
      bind:value={searchQuery}
      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
    />
  </div>

  <!-- Blog Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredItems as blog (blog.slug)}
      <div class="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <iconify-icon icon="mdi:calendar" width="16" height="16"></iconify-icon>
          <span>{blog.date}</span>
        </div>

        <h3 class="text-lg font-bold text-gray-900 dark:text-blue-400 mb-2 line-clamp-2">
          {blog.title}
        </h3>

        <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
          {blog.description}
        </p>

        {#if blog.tags && blog.tags.length > 0}
          <div class="flex flex-wrap gap-1 mb-3">
            {#each blog.tags.slice(0, 3) as tag}
              <span class="text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                #{tag}
              </span>
            {/each}
            {#if blog.tags.length > 3}
              <span class="text-xs text-gray-600 dark:text-gray-400 px-2 py-1">
                +{blog.tags.length - 3}
              </span>
            {/if}
          </div>
        {/if}

        <a
          href="/blogs/{blog.slug}"
          class="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors"
        >
          Read More
          <iconify-icon icon="mdi:arrow-right" width="16" height="16"></iconify-icon>
        </a>
      </div>
    {/each}
  </div>

  <!-- No Results -->
  {#if filteredItems.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">
        No posts found matching "{searchQuery}"
      </p>
    </div>
  {/if}
</div>
