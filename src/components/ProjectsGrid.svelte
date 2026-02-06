<script>
  export let items = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each items as project (project.slug)}
    <a
      href={`/projects/${project.slug}`}
      class="group border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
    >
      <!-- Project Image -->
      {#if project.image}
        <div class="relative overflow-hidden bg-gray-200 dark:bg-gray-800 h-48">
          <img 
            src={project.image} 
            alt={project.title}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      {:else}
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center">
          <span class="text-white font-bold text-2xl" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            {project.title.charAt(0)}
          </span>
        </div>
      {/if}

      <!-- Project Info -->
      <div class="p-5">
        <div class="flex items-baseline gap-2 mb-2 flex-wrap">
          <h3 
            class="text-lg font-bold text-gray-900 dark:text-gray-100"
            style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;"
          >
            {project.title}
          </h3>
          <span class="text-xs font-semibold px-2 py-0.5 border border-gray-400 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400">
            {project.year}
          </span>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {project.description}
        </p>

        <!-- Tech Stack Tags -->
        {#if project.technologies && project.technologies.length > 0}
          <div class="flex flex-wrap gap-1.5">
            {#each project.technologies.slice(0, 3) as tech}
              <span 
                class="px-2 py-1 text-xs border border-gray-400 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
              >
                {tech.name}
              </span>
            {/each}
            {#if project.technologies.length > 3}
              <span 
                class="px-2 py-1 text-xs border border-gray-400 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
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
