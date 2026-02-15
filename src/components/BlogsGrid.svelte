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
  let selectedTags: string[] = [];

  export { items as items };

  const normalize = (value: string) => value.toLowerCase().trim();

  const addTag = (tag: string) => {
    const normalized = normalize(tag).replace(/^#+/, '');
    if (!normalized) return;
    if (!selectedTags.includes(normalized)) {
      selectedTags = [...selectedTags, normalized];
    }
  };

  const removeTag = (tag: string) => {
    selectedTags = selectedTags.filter((item) => item !== tag);
  };

  const addTagFromQuery = () => {
    if (!searchQuery.trim().startsWith('#')) return;
    const tag = normalize(searchQuery.replace(/^#+/, ''));
    if (!tag) return;
    addTag(tag);
    searchQuery = '#';
  };

  $: tagCounts = items.reduce((acc, blog) => {
    (blog.tags ?? []).forEach((tag) => {
      const key = normalize(tag);
      if (!key) return;
      acc[key] = (acc[key] ?? 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  $: tagMatches = (() => {
    const query = normalize(searchQuery);
    if (!query.startsWith('#')) return [];
    const tagQuery = normalize(query.replace(/^#+/, ''));
    return Object.keys(tagCounts)
      .filter((tag) => (tagQuery.length === 0 || tag.startsWith(tagQuery)) && !selectedTags.includes(tag))
      .sort((a, b) => {
        const countDiff = tagCounts[b] - tagCounts[a];
        return countDiff !== 0 ? countDiff : a.localeCompare(b);
      });
  })();

  $: displayTagMatches = tagMatches.slice(0, 10);

  $: filteredItems = items.filter((blog) => {
    const query = normalize(searchQuery);
    if (!query) return true;

    const tags = (blog.tags ?? []).map(normalize);

    const hasSelectedTags = selectedTags.length > 0;
    const tagQuery = query.startsWith('#') ? normalize(query.replace(/^#+/, '')) : '';
    const matchesSelectedTags = hasSelectedTags ? selectedTags.some((tag) => tags.includes(tag)) : true;
    const matchesTagQuery = hasSelectedTags
      ? true
      : tagQuery.length > 0
        ? tags.some((tag) => tag.startsWith(tagQuery))
        : true;
    const textQuery = query.startsWith('#') ? '' : query;

    const title = normalize(blog.title ?? '');
    const description = normalize(blog.description ?? '');
    const matchesText = textQuery.length > 0 ? title.includes(textQuery) || description.includes(textQuery) : true;

    return matchesSelectedTags && matchesTagQuery && matchesText;
  });
</script>

<div class="space-y-6">
  <!-- Search Bar -->
  <div class="mb-6">
    <input
      type="text"
      placeholder="Find post...(start with # to find tags)"
      bind:value={searchQuery}
      on:keydown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          addTagFromQuery();
        }
        if (event.key === 'Backspace' && searchQuery.trim() === '#' && selectedTags.length > 0) {
          event.preventDefault();
          selectedTags = selectedTags.slice(0, -1);
        }
        if ((event.key === ',' || event.key === ' ') && searchQuery.trim().startsWith('#')) {
          event.preventDefault();
          addTagFromQuery();
        }
      }}
      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
    />

    {#if selectedTags.length > 0}
      <div class="mt-3 flex items-center justify-between gap-3">
        <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Active tags
        </p>
        <button
          type="button"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          on:click={() => (selectedTags = [])}
        >
          Clear all
        </button>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        {#each selectedTags as tag}
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            #{tag}
            <button
              type="button"
              class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label={`Remove ${tag}`}
              on:click={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        {/each}
      </div>
    {/if}

    {#if searchQuery.trim().startsWith('#')}
      <div class="mt-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div class="px-4 py-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Recommended
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-800 max-h-64 overflow-auto">
          {#if displayTagMatches.length > 0}
            {#each displayTagMatches as tag}
              <button
                type="button"
                class="w-full flex items-center justify-between gap-3 text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                on:click={() => {
                  addTag(tag);
                  searchQuery = '#';
                }}
              >
                <span class="text-gray-900 dark:text-gray-100">#{tag}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {tagCounts[tag]} result{tagCounts[tag] === 1 ? '' : 's'}
                </span>
              </button>
            {/each}
            {#if tagMatches.length > displayTagMatches.length}
              <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                Showing top {displayTagMatches.length} tags
              </div>
            {/if}
          {:else}
            <div class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              No tags found
            </div>
          {/if}
        </div>
      </div>
    {/if}
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
