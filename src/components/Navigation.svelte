<script>
  import { onMount } from 'svelte';

  const sections = [
    { id: 'about', title: 'About', icon: 'mdi:card-account-details-outline' },
    { id: 'work', title: 'Work Experience', icon: 'mdi:briefcase-outline' },
    { id: 'studies', title: 'Studies', icon: 'mdi:school-outline' },
    { id: 'projects', title: 'Projects', icon: 'mdi:wrench-outline' },
    { id: 'certifications', title: 'Certifications', icon: 'mdi:certificate-outline' },
    { id: 'blogs', title: 'Blogs', icon: 'mdi:pencil-outline' },
    { id: 'files', title: 'Files', icon: 'mdi:folder-outline' },
  ];

  let openSections = new Set(['about']);

  onMount(() => {
    const hashSection = window.location.hash.replace('#', '');
    const hasMatchingSection = sections.some((section) => section.id === hashSection);
    if (hasMatchingSection) {
      openSections = new Set([hashSection]);
    }
  });

  const toggleSection = (id) => {
    if (openSections.has(id)) {
      openSections.delete(id);
    } else {
      openSections.add(id);
    }
    openSections = new Set(openSections);
  };
</script>

<nav class="container mx-auto px-4 sm:px-5 md:px-6 py-3 md:py-6">
  <div class="space-y-2.5 sm:space-y-3 md:space-y-4">
    {#each sections as section, index}
      <div
        id={section.id}
        class="section-item group reveal"
        data-section={section.id}
        style={`--reveal-delay: ${index}`}
      >
        <button
          class="section-button w-full flex items-center justify-between py-2.5 sm:py-3 md:py-4 px-3.5 sm:px-4 md:px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left reveal-pop"
          aria-expanded={openSections.has(section.id)}
          style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;"
          on:click={() => toggleSection(section.id)}
        >
          <div class="flex items-center gap-2.5 sm:gap-3 md:gap-4">
            <iconify-icon icon={section.icon} width="20" height="20"></iconify-icon>
            <span class="text-base sm:text-lg md:text-xl">{section.title}</span>
          </div>
          <svg
            class={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${openSections.has(section.id) ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {#if openSections.has(section.id)}
          <div class="section-content px-3.5 sm:px-4 md:px-6 pb-3 md:pb-4 border-l-2 border-current opacity-100 ml-2 md:ml-3 py-1.5 md:py-2 reveal" style="font-family: 'Plus Jakarta Sans', sans-serif;">
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
            {:else if section.id === 'studies'}
              <slot name="studies">
                <p class="text-gray-600 dark:text-gray-400">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'projects'}
              <slot name="projects">
                <p class="text-gray-600 dark:text-gray-400">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'certifications'}
              <slot name="certifications">
                <p class="text-gray-600 dark:text-gray-400">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'blogs'}
              <slot name="blogs">
                <p class="text-gray-600 dark:text-gray-400">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'files'}
              <slot name="files">
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
