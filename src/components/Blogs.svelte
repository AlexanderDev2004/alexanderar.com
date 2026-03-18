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
      <div
        class="surface-item rounded-lg p-4 transition-all duration-200 reveal pressable"
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

          <a
            href="/blogs/{blog.slug}"
            class="inline-flex items-center gap-2 accent-link font-medium text-sm transition-colors"
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
          class="inline-flex items-center gap-2 px-6 py-3 rounded transition-colors font-medium text-sm primary-text"
          style="border: 1px solid var(--surface-border); background: var(--surface);"
        >
          – SEE MORE
        </a>
      </div>
    {/if}
  {:else}
    <div class="text-center py-8">
      <p class="muted-text">Sorry, blog posts are not available.</p>
    </div>
  {/if}
</div>
