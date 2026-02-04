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
  {#each works as work, index (index)}
    <div class="border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <!-- Header yang bisa di-click -->
      <button
        type="button"
        onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
        class="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-opacity-50 cursor-pointer"
      >
        <div class="flex-1 min-w-0">
          <!-- Title dan Job Title -->
          <div class="flex items-baseline gap-3 mb-2 flex-wrap">
            {#if work.link}
              <a 
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                class="text-lg font-bold hover:underline text-blue-600 dark:text-blue-400"
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
                onclick={(e) => e.stopPropagation()}
              >
                {work.company}
              </a>
            {:else}
              <h3 
                class="text-lg font-bold"
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
              >
                {work.company}
              </h3>
            {/if}
            <!-- Status Badges -->
            {#if work.status}
              <div class="flex gap-2 flex-wrap">
                {#each work.status as stat}
                  <span class="text-xs font-semibold px-2 py-1 border border-gray-400 dark:border-gray-600 rounded">
                    {stat}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
          
          <!-- Job Title -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            {work.jobTitle}
          </p>
        </div>

        <!-- Date di sebelah kanan -->
        <div class="text-right whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {work.startDate} - {work.endDate === null || work.endDate === undefined || work.endDate === '' ? 'Present' : work.endDate}
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
        <div class="px-5 pb-5 border-t border-gray-300 dark:border-gray-700 space-y-4">
          <!-- Description dengan bullet points -->
          {#if work.description && work.description.length > 0}
            <ul class="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
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
                  class="px-3 py-1 border border-gray-400 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300"
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
</div>

<style>
  :global(li) {
    margin-left: 0.5rem;
  }
</style>
