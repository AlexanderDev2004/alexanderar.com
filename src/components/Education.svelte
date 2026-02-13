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

<div class="space-y-3">
  {#each items as item, index (index)}
    <div class="border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <!-- Header yang bisa di-click -->
      <button
        type="button"
        onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
        class="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-opacity-50 cursor-pointer"
      >
        <div class="flex-1 min-w-0">
          <!-- Degree Title -->
          <h3 
            class="text-lg font-bold"
            style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
          >
            {item.degree}
          </h3>
          
          <!-- Institution -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            {item.institution}
          </p>
        </div>

        <!-- Date di sebelah kanan -->
        <div class="text-right whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {item.startDate} - {item.endDate === null || item.endDate === undefined || item.endDate === '' ? 'Now' : item.endDate}
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

      <!-- Content yang expandable (untuk future content seperti GPA, courses, dll) -->
      {#if expandedIndex === index}
        <div class="px-5 pb-5 border-t border-gray-300 dark:border-gray-700 space-y-4">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Coming Soon...
          </p>
        </div>
      {/if}
    </div>
  {/each}
</div>
