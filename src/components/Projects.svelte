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
  {#each items.slice(0, 5) as project, index (project.slug)}
    <div class="border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors overflow-hidden">
      <!-- Header yang bisa di-click -->
      <button
        type="button"
        onclick={(e) => { e.preventDefault(); toggleExpand(index); }}
        class="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-opacity-50 cursor-pointer"
      >
        <div class="flex-1 min-w-0">
          <!-- Project Title as Link -->
          <div class="flex items-baseline gap-3 mb-3 flex-wrap">
            <a 
              href={`/projects/${project.slug}`}
              class="text-lg font-bold hover:underline text-blue-600 dark:text-blue-400"
              style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
              onclick={(e) => e.stopPropagation()}
            >
              {project.title}
            </a>
            <span class="text-xs font-semibold px-3 py-1 border border-gray-400 dark:border-gray-600 rounded">
              {project.year}
            </span>
          </div>
          
          <!-- Description -->
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            {project.description}
          </p>
        </div>

        <!-- Chevron Icon -->
        <div class="flex items-center flex-shrink-0">
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
          <!-- Full Description -->
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          <!-- Links -->
          <div class="flex gap-3 flex-wrap">
            {#if project.projectLink}
              <a 
                href={project.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium"
                onclick={(e) => e.stopPropagation()}
              >
                <span>View Project</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            {/if}

            {#if project.repoLink}
              <a 
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                onclick={(e) => e.stopPropagation()}
              >
                <span>View Repo</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            {/if}
          </div>

          <!-- Tech Stack -->
          {#if project.technologies && project.technologies.length > 0}
            <div>
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                Tech Stack
              </h4>
              <div class="flex flex-wrap gap-2">
                {#each project.technologies as tech}
                  <a
                    href={tech.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-3 py-2 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                    onclick={(e) => e.stopPropagation()}
                    title={`Learn more about ${tech.name}`}
                  >
                    <iconify-icon icon={tech.icon} width="18" height="18"></iconify-icon>
                    <span class="text-gray-700 dark:text-gray-300">{tech.name}</span>
                  </a>
                {/each}
              </div>
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
        href="/all-projects"
        class="inline-flex items-center gap-2 px-6 py-3 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
        style="font-family: 'Plus Jakarta Sans', sans-serif;"
      >
        <span>– SEE MORE</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  {/if}
</div>
