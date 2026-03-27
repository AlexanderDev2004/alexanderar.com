<script>
  export let items = [];
  
  let expandedIndex = -1;
  
  function toggleExpand(index) {
    if (expandedIndex === index) {
      expandedIndex = -1;
    } else {
      expandedIndex = index;
    }
  }
</script>

<div class="space-y-4">
  {#if items.length > 0}
    {#each items.slice(0, 2) as cert, index (index)}
      <div
        class="surface-item rounded-lg transition-colors overflow-hidden reveal"
        style={`--reveal-delay: ${index}`}
      >
        <!-- Header yang bisa di-click -->
        <button
          type="button"
          onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
          class="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-opacity-50 cursor-pointer pressable"
        >
          <div class="flex-1 min-w-0">
            <!-- Certification Title -->
            <div class="flex items-baseline gap-3 mb-2 flex-wrap">
              <h3 
                class="text-lg font-bold primary-text"
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
              >
                {cert.title}
              </h3>
              <span class="pill-chip text-xs font-semibold px-3 py-1">
                {cert.year}
              </span>
            </div>
            
            <!-- Description Preview -->
            <p class="text-sm muted-text line-clamp-2" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              {cert.description}
            </p>
          </div>

          <!-- Chevron Icon -->
          <div class="flex items-center">
            <svg
              class="w-5 h-5 transition-transform duration-300 {expandedIndex === index ? 'rotate-180' : ''}"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        <!-- Content yang expandable -->
        {#if expandedIndex === index}
          <div class="px-5 pb-5 space-y-4 expand-reveal" style="border-top: 1px solid var(--surface-border);">
            <!-- Full Description -->
            <div>
              <p class="text-sm primary-text leading-relaxed">
                {cert.description}
              </p>
            </div>

            <!-- Certificate Link -->
            {#if cert.certificateLink}
              <div>
                <a 
                  href={cert.certificateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 border rounded transition-colors text-sm font-medium"
                  style="border-color: var(--accent); color: var(--accent); background: var(--accent-soft);"
                  onclick={(e) => e.stopPropagation()}
                >
                  <span>View Certificate</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            {/if}

            <!-- Tags -->
            {#if cert.tags && cert.tags.length > 0}
              <div class="flex flex-wrap gap-2">
                {#each cert.tags as tag}
                  <span 
                    class="pill-chip px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}

    <!-- See More Button -->
    {#if items.length > 2}
      <div class="flex justify-center pt-4">
        <a 
          href="/all-certifications"
          class="see-more-btn"
          aria-label="See more certifications"
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
      <p class="muted-text">Sorry, certifications are not available.</p>
    </div>
  {/if}
</div>
