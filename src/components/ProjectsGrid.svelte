<script>
  export let items = [];
</script>

{#if items.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {#each items as project, index (project.slug)}
      <a
        href={`/projects/${project.slug}`}
        class="group surface-item rounded-lg overflow-hidden transition-colors cursor-pointer reveal pressable"
        style={`--reveal-delay: ${index}`}
      >
        <!-- Project Image -->
        {#if project.image}
          <div class="relative overflow-hidden bg-gray-200 dark:bg-gray-800 h-40 sm:h-44 md:h-48">
            <img 
              src={project.image} 
              alt={project.title}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        {:else}
          <div class="bg-linear-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center">
            <span class="text-white font-bold text-2xl" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              {project.title.charAt(0)}
            </span>
          </div>
        {/if}

        <!-- Project Info -->
        <div class="p-4 sm:p-5">
          <div class="flex items-baseline gap-2 mb-2 flex-wrap">
            <h3 
              class="text-base sm:text-lg font-bold primary-text"
              style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
            >
              {project.title}
            </h3>
            <span class="pill-chip text-xs font-semibold px-2 py-0.5 muted-text">
              {project.year}
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm muted-text line-clamp-2 mb-4">
            {project.description}
          </p>

          <!-- Tech Stack Tags -->
          {#if project.technologies && project.technologies.length > 0}
            <div class="flex flex-wrap gap-1.5">
              {#each project.technologies.slice(0, 3) as tech}
                <span 
                  class="pill-chip px-2 py-1 text-[11px] sm:text-xs"
                >
                  {tech.name}
                </span>
              {/each}
              {#if project.technologies.length > 3}
                <span 
                  class="pill-chip px-2 py-1 text-[11px] sm:text-xs"
                >
                  +{project.technologies.length - 3}
                </span>
              {/if}
            </div>
          {/if}
        </div>
      </a>
    {/each}
  </div>
{:else}
  <div class="text-center py-8">
    <p class="muted-text">Sorry, projects are not available.</p>
  </div>
{/if}
