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
      class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base transition-colors"
      style="border-color: var(--surface-border); background: var(--surface-strong); color: var(--text-primary);"
    />

    {#if selectedTags.length > 0}
      <div class="mt-3 flex items-center justify-between gap-3">
        <p class="text-xs uppercase tracking-wide muted-text">
          Active tags
        </p>
        <button
          type="button"
          class="text-xs muted-text hover:opacity-80 transition-colors"
          on:click={() => (selectedTags = [])}
        >
          Clear all
        </button>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        {#each selectedTags as tag}
          <span class="pill-chip inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm">
            #{tag.toUpperCase()}
            <button
              type="button"
              class="muted-text hover:opacity-80"
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
      <div class="mt-3 border rounded-xl shadow-sm overflow-hidden" style="border-color: var(--surface-border); background: var(--surface-strong);">
        <div class="px-4 py-2 text-xs uppercase tracking-wide muted-text">
          Recommended
        </div>
        <div class="max-h-64 overflow-auto" style="border-top: 1px solid var(--surface-border);">
          {#if displayTagMatches.length > 0}
            {#each displayTagMatches as tag}
              <button
                type="button"
                class="w-full flex items-center justify-between gap-3 text-left px-4 py-2 transition-colors"
                style="border-bottom: 1px solid var(--surface-border);"
                on:click={() => {
                  addTag(tag);
                  searchQuery = '#';
                }}
              >
                <span class="primary-text">#{tag.toUpperCase()}</span>
                <span class="text-xs muted-text">
                  {tagCounts[tag]} result{tagCounts[tag] === 1 ? '' : 's'}
                </span>
              </button>
            {/each}
            {#if tagMatches.length > displayTagMatches.length}
              <div class="px-4 py-2 text-xs muted-text">
                Showing top {displayTagMatches.length} tags
              </div>
            {/if}
          {:else}
            <div class="px-4 py-2 text-sm muted-text">
              No tags found
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <!-- Blog Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {#each filteredItems as blog (blog.slug)}
      <a
        href="/blogs/{blog.slug}"
        aria-label={`Read post: ${blog.title}`}
        class="group surface-item rounded-lg p-3 sm:p-4 transition-all duration-200 pressable block no-underline"
      >
        <div class="flex items-center gap-2 text-xs sm:text-sm muted-text mb-2">
          <iconify-icon icon="mdi:calendar" width="16" height="16"></iconify-icon>
          <span>{blog.date}</span>
        </div>

        <h3 class="text-base sm:text-lg font-bold accent-link mb-2 line-clamp-2">
          {blog.title}
        </h3>

        <p class="text-sm primary-text line-clamp-3 mb-3">
          {blog.description}
        </p>

        {#if blog.tags && blog.tags.length > 0}
          <div class="flex flex-wrap gap-1 mb-3">
            {#each blog.tags.slice(0, 3) as tag}
              <span class="pill-chip text-[11px] sm:text-xs px-2 py-1">
                #{tag}
              </span>
            {/each}
            {#if blog.tags.length > 3}
              <span class="text-[11px] sm:text-xs muted-text px-2 py-1">
                +{blog.tags.length - 3}
              </span>
            {/if}
          </div>
        {/if}

        <span class="inline-flex items-center gap-2 accent-link font-medium text-xs sm:text-sm transition-colors">
          Read More
          <iconify-icon icon="mdi:arrow-right" width="16" height="16"></iconify-icon>
        </span>
      </a>
    {/each}
  </div>

  <!-- No Results -->
  {#if filteredItems.length === 0}
    <div class="text-center py-8">
      {#if searchQuery.trim().length > 0 || selectedTags.length > 0}
        <p class="muted-text">
          No posts found matching "{searchQuery}"
        </p>
      {:else}
        <p class="muted-text">Sorry, blog posts are not available.</p>
      {/if}
    </div>
  {/if}
</div>
