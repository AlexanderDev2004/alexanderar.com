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
  {#if items.length > 0}
    {#each items.slice(0, 2) as blog, index (blog.slug)}
      <a
        href="/blogs/{blog.slug}"
        aria-label={`Read post: ${blog.title}`}
        class="group surface-item rounded-lg p-4 transition-all duration-200 reveal pressable block no-underline"
        style={`--reveal-delay: ${index}`}
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold accent-link line-clamp-2">
              {blog.title}
            </h3>
            <div class="flex items-center gap-2 mt-2 text-sm muted-text">
              <iconify-icon icon="mdi:calendar" width="16" height="16"></iconify-icon>
              <span>{blog.date}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-3 primary-text">
          <p class="text-sm leading-relaxed line-clamp-3">{blog.description}</p>

          {#if blog.tags && blog.tags.length > 0}
            <div class="flex flex-wrap gap-2 pt-2">
              {#each blog.tags as tag}
                <span class="pill-chip text-xs px-2 py-1">
                  #{tag}
                </span>
              {/each}
            </div>
          {/if}

          <span class="inline-flex items-center gap-2 accent-link font-medium text-sm transition-colors">
            Read
            <iconify-icon icon="mdi:arrow-right" width="16" height="16"></iconify-icon>
          </span>
        </div>
      </a>
    {/each}

    {#if items.length > 2}
      <div class="flex justify-center pt-4">
        <a
          href="/all-blogs"
          class="see-more-btn"
          aria-label="See more blog posts"
        >
          <span>See More</span>
          <svg class="see-more-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    {/if}
  {:else}
    <div class="text-center py-8">
      <p class="muted-text">Sorry, blog posts are not available.</p>
    </div>
  {/if}
</div>
