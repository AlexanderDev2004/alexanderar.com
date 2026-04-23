<script>
  import { onMount } from 'svelte';

  const sections = [
    {
      id: 'about',
      title: 'About',
      hint: 'Quick overview and introduction',
      icon: 'mdi:card-account-details-outline',
    },
    {
      id: 'work',
      title: 'Work Experience',
      hint: 'Roles, impact, and stack',
      icon: 'mdi:briefcase-outline',
    },
    {
      id: 'studies',
      title: 'Studies',
      hint: 'Academic background',
      icon: 'mdi:school-outline',
    },
    {
      id: 'projects',
      title: 'Projects',
      hint: 'Selected things I have built',
      icon: 'mdi:wrench-outline',
    },
    {
      id: 'certifications',
      title: 'Certifications',
      hint: 'Proof of continuous learning',
      icon: 'mdi:certificate-outline',
    },
    {
      id: 'blogs',
      title: 'Blogs',
      hint: 'Writing and notes',
      icon: 'mdi:pencil-outline',
    },
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

<nav class="container mx-auto px-4 sm:px-5 md:px-6 py-4 md:py-6">
  <div class="space-y-3 sm:space-y-3.5 md:space-y-4">
    {#each sections as section, index}
      <section
        id={section.id}
        class={`section-shell section-card group reveal ${openSections.has(section.id) ? 'section-card--open' : ''}`}
        data-section={section.id}
        style={`--reveal-delay: ${index}`}
      >
        <button
          class="section-trigger reveal-pop"
          aria-expanded={openSections.has(section.id)}
          on:click={() => toggleSection(section.id)}
        >
          <div class="section-leading">
            <span class="section-icon" aria-hidden="true">
              <iconify-icon icon={section.icon} width="20" height="20"></iconify-icon>
            </span>
          </div>

          <div class="section-copy">
            <span class="section-title">{section.title}</span>
            <span class="section-hint">{section.hint}</span>
          </div>

          <svg
            class={`section-chevron ${openSections.has(section.id) ? 'rotate-180' : ''}`}
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
          <div class="section-content expand-reveal">
            {#if section.id === 'about'}
              <slot name="about">
                <p class="muted-text">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'work'}
              <slot name="work">
                <p class="muted-text">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'studies'}
              <slot name="studies">
                <p class="muted-text">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'projects'}
              <slot name="projects">
                <p class="muted-text">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'certifications'}
              <slot name="certifications">
                <p class="muted-text">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else if section.id === 'blogs'}
              <slot name="blogs">
                <p class="muted-text">
                  Content for {section.title} section coming soon...
                </p>
              </slot>
            {:else}
              <p class="muted-text">
                Content for {section.title} section coming soon...
              </p>
            {/if}
          </div>
        {/if}
      </section>
    {/each}
  </div>
</nav>

<style>
  .section-card {
    border-radius: 1rem;
    overflow: hidden;
    transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
  }

  .section-card:hover {
    transform: translateY(-2px);
  }

  .section-card--open {
    border-color: var(--accent);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.38);
  }

  .section-trigger {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    border: 0;
    background: transparent;
    color: inherit;
    padding: 0.9rem 0.95rem;
    cursor: pointer;
  }

  .section-leading {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
  }

  .section-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 0.7rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--surface-border-soft);
    background: var(--accent-soft);
  }

  .section-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .section-title {
    font-size: clamp(1rem, 2.2vw, 1.24rem);
    font-weight: 700;
    line-height: 1.2;
  }

  .section-hint {
    margin-top: 0.15rem;
    color: var(--text-muted);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .section-chevron {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.26s ease;
  }

  .section-content {
    margin: 0 0.95rem 0.95rem;
    border-radius: 0.84rem;
    border: 1px solid var(--surface-border-soft);
    background: var(--surface-strong);
    padding: 0.9rem;
  }

  @media (min-width: 640px) {
    .section-trigger {
      gap: 0.95rem;
      padding: 1rem 1.2rem;
    }

    .section-content {
      margin: 0 1.2rem 1.2rem;
      padding: 1rem 1.1rem;
    }
  }

  @media (min-width: 768px) {
    .section-trigger {
      gap: 1.1rem;
      padding: 1.05rem 1.35rem;
    }

    .section-icon {
      width: 2.1rem;
      height: 2.1rem;
    }

    .section-chevron {
      width: 1.35rem;
      height: 1.35rem;
    }

    .section-content {
      margin: 0 1.35rem 1.35rem;
      padding: 1.05rem 1.18rem;
    }
  }
</style>
