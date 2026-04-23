<script>
  export let works = [];
  
  let expandedIndex = -1;
  
  function toggleExpand(index) {
    if (expandedIndex === index) {
      expandedIndex = -1;
    } else {
      expandedIndex = index;
    }
  }
</script>

<div class="space-y-3">
  {#if works.length > 0}
    {#each works as work, index (index)}
      <div
        class="surface-item rounded-lg transition-colors reveal"
        style={`--reveal-delay: ${index}`}
      >
        <!-- Header yang bisa di-click -->
        <button
          type="button"
          onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
          class="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:bg-opacity-50 cursor-pointer pressable"
        >
          <div class="flex-1 min-w-0">
            <!-- Title dan Job Title -->
            <div class="flex items-baseline gap-3 mb-2 flex-wrap">
              {#if work.link}
                <a 
                  href={work.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-base sm:text-lg font-bold hover:underline accent-link"
                  style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
                  onclick={(e) => e.stopPropagation()}
                >
                  {work.company}
                </a>
              {:else}
                <h3 
                  class="text-base sm:text-lg font-bold"
                  style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
                >
                  {work.company}
                </h3>
              {/if}
              <!-- Status Badges -->
              {#if work.status}
                <div class="flex gap-2 flex-wrap">
                  {#each work.status as stat}
                    <span class="pill-chip text-[11px] sm:text-xs font-semibold px-2 py-1">
                      {stat}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
            
            <!-- Job Title -->
            <p class="text-xs sm:text-sm muted-text mb-2" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              {work.jobTitle}
            </p>

            {#if work.country}
              <p class="text-xs sm:text-sm muted-text mb-2" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                {work.country}
              </p>
            {/if}
          </div>

          <!-- Date + Chevron -->
          <div class="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm muted-text sm:ml-auto">
            <span class="whitespace-nowrap">
              {work.startDate} - {work.endDate === null || work.endDate === undefined || work.endDate === '' ? 'Present' : work.endDate}
            </span>
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
          <div class="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 expand-reveal" style="border-top: 1px solid var(--surface-border);">
            <!-- Description dengan bullet points -->
            {#if work.description && work.description.length > 0}
              <ul class="work-list list-disc list-inside space-y-2 text-xs sm:text-sm primary-text">
                {#each work.description as item}
                  <li>{item}</li>
                {/each}
              </ul>
            {/if}

            <!-- Tags/Skills -->
            {#if work.tags && work.tags.length > 0}
              <div class="flex flex-wrap gap-2 pt-2">
                {#each work.tags as tag}
                  <span 
                    class="pill-chip px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium"
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
  {:else}
    <div class="text-center py-8">
      <p class="muted-text">Sorry, work experience is not available.</p>
    </div>
  {/if}
</div>

<style>
  .work-list :global(li) {
    margin-left: 0.5rem;
  }
</style>
