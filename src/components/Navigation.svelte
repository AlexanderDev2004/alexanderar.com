<script>
  const sections = [
    { id: 'about', title: 'About', icon: 'mdi:card-account-details-outline' },
    { id: 'work', title: 'Work Experience', icon: 'mdi:briefcase-outline' },
    { id: 'studies', title: 'Studies', icon: 'mdi:school-outline' },
    { id: 'projects', title: 'Projects', icon: 'mdi:wrench-outline' },
    { id: 'certifications', title: 'Certifications', icon: 'mdi:certificate-outline' },
    { id: 'blogs', title: 'Blogs', icon: 'mdi:pencil-outline' },
    { id: 'files', title: 'Files', icon: 'mdi:folder-outline' },
    { id: 'contact', title: 'Contact', icon: 'mdi:phone-outline' },
  ];

  let openSection = '';

  const toggleSection = (id) => {
    openSection = openSection === id ? '' : id;
  };
</script>

<nav class="container mx-auto px-6 py-4 md:py-6">
  <div class="space-y-3 md:space-y-4">
    {#each sections as section}
      <div class="section-item group" data-section={section.id}>
        <button
          class="section-button w-full flex items-center justify-between py-3 md:py-4 px-4 md:px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
          aria-expanded={openSection === section.id}
          style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;"
          on:click={() => toggleSection(section.id)}
        >
          <div class="flex items-center gap-3 md:gap-4">
            <iconify-icon icon={section.icon} width="24" height="24"></iconify-icon>
            <span class="text-xl">{section.title}</span>
          </div>
          <svg
            class={`w-6 h-6 transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {#if openSection === section.id}
          <div class="section-content px-4 md:px-6 pb-4 border-l-2 border-current opacity-100 ml-3" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            {#if section.id === 'about'}
              <slot name="about">
                <p class="text-gray-600 dark:text-gray-400">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'work'}
              <slot name="work">
                <p class="text-gray-600 dark:text-gray-400">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else}
              <p class="text-gray-600 dark:text-gray-400">
                Content for {section.title} section coming soon...
              </p>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</nav>

<style>
  .section-content {
    transition: opacity 0.3s ease-in-out;
  }
</style>
