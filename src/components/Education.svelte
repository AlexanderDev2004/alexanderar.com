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
  {#if items.length > 0}
    {#each items as item, index (index)}
      <div
        class="surface-item rounded-lg transition-colors reveal"
        style={`--reveal-delay: ${index}`}
      >
        <!-- Header yang bisa di-click -->
        <button
          type="button"
          onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
          class="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-opacity-50 cursor-pointer pressable"
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
            <p class="text-sm muted-text mt-1" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              {item.institution}
            </p>
          </div>

          <!-- Date di sebelah kanan -->
          <div class="text-right whitespace-nowrap text-sm muted-text">
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
          <div class="px-5 pb-5 space-y-4 expand-reveal" style="border-top: 1px solid var(--surface-border);">
            <p class="text-sm muted-text">
              Coming Soon...
            </p>
          </div>
        {/if}
      </div>
    {/each}
  {:else}
    <div class="text-center py-8">
      <p class="muted-text">Sorry, studies are not available.</p>
    </div>
  {/if}
</div>
