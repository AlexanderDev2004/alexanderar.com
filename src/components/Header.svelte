<script lang="ts">
  import { contacts } from '../data/contact';

  const isExternalLink = (href: string) => /^https?:\/\//.test(href);
  const githubHref = contacts.find((item) => item.id === 'github')?.href ?? 'https://github.com/AlexanderDev2004';
</script>

<header class="relative z-10">
  <a
    href="/bookmarks"
    title="Bookmarks Vault"
    class="bookmark-link bookmark-link--page-corner"
    aria-label="Open bookmarks vault"
  >
    <iconify-icon icon="mdi:bookmark-outline" width="20" height="20"></iconify-icon>
  </a>

  <div class="container mx-auto px-4 sm:px-5 md:px-6 pt-5 md:pt-8">
    <div class="glass-panel rounded-2xl md:rounded-3xl px-5 sm:px-6 md:px-8 py-5 sm:py-6 md:py-7 reveal">
      <div class="flex flex-col gap-5 sm:gap-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
          <div class="space-y-3 max-w-3xl">
            <p class="eyebrow">Portfolio</p>
            <a href="/" aria-label="Home" class="name-link">
              Alexander Agung Raya
            </a>
            <p class="role-copy">Software Developer building practical products for web and interactive experiences.</p>
            <div class="flex flex-wrap gap-2">
              <span class="meta-chip">he/him/他</span>
              <span class="meta-chip meta-chip--location">
                <iconify-icon icon="mdi:map-marker" width="16" height="16"></iconify-icon>
                Indonesia, East Java
              </span>
            </div>
          </div>

          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            class="profile-link"
            aria-label="Open GitHub profile"
            title="GitHub Profile"
          >
            <img
              src="/IconAlex.png"
              alt="Alexander avatar"
              width="104"
              height="104"
              loading="eager"
              decoding="async"
            />
          </a>
        </div>

        <div class="flex flex-wrap gap-2.5 sm:gap-3">
          {#each contacts as item}
            <a
              href={item.href}
              target={isExternalLink(item.href) ? '_blank' : undefined}
              rel={isExternalLink(item.href) ? 'noopener noreferrer' : undefined}
              class="contact-link"
            >
              <iconify-icon icon={item.icon} width="17" height="17"></iconify-icon>
              <span>{item.label}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>

    <div class="soft-divider mt-5 md:mt-7"></div>
  </div>
</header>

<style>
  .eyebrow {
    margin: 0;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }

  .name-link {
    display: inline-block;
    font-size: clamp(1.95rem, 4.8vw, 3.35rem);
    line-height: 1.05;
    letter-spacing: -0.032em;
    font-weight: 780;
    color: var(--text-primary);
    text-wrap: balance;
  }

  .role-copy {
    margin: 0;
    max-width: 40rem;
    font-size: clamp(0.95rem, 2.2vw, 1.08rem);
    line-height: 1.65;
    color: var(--text-muted);
  }

  .meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.38rem;
    border-radius: 999px;
    border: 1px solid var(--surface-border);
    background: var(--accent-soft);
    color: var(--text-primary);
    padding: 0.35rem 0.72rem;
    font-size: 0.76rem;
    font-weight: 600;
  }

  .meta-chip--location {
    background: var(--surface-strong);
  }

  .bookmark-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 1px solid var(--surface-border);
    background: var(--surface-strong);
    color: var(--text-muted);
    width: 2.7rem;
    height: 2.7rem;
    opacity: 0.01;
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.16);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease, opacity 0.1s ease;
  }

  .bookmark-link:hover,
  .bookmark-link:focus-visible {
    transform: translateY(-1px);
    opacity: 0.80;
    color: var(--text-primary);
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  .bookmark-link--page-corner {
    position: absolute;
    top: calc(env(safe-area-inset-top, 0px) + 0.9rem);
    right: calc(env(safe-area-inset-right, 0px) + 0.9rem);
    z-index: 20;
  }

  .profile-link {
    align-self: flex-end;
    display: inline-flex;
    width: clamp(4.7rem, 18vw, 6.2rem);
    aspect-ratio: 1;
    border-radius: 999px;
    border: 1px solid var(--surface-border);
    background: var(--surface-strong);
    padding: 0.34rem;
    box-shadow: 0 14px 26px rgba(15, 23, 42, 0.16);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }

  .profile-link img {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    object-fit: cover;
    image-rendering: pixelated;
    display: block;
  }

  .profile-link:hover,
  .profile-link:focus-visible {
    transform: translateY(-2px);
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  @media (min-width: 768px) {
    .profile-link {
      align-self: flex-start;
      margin-top: 0.18rem;
    }
  }

  @media (min-width: 640px) {
    .bookmark-link--page-corner {
      top: calc(env(safe-area-inset-top, 0px) + 1.15rem);
      right: calc(env(safe-area-inset-right, 0px) + 1.25rem);
    }
  }

  @media (min-width: 768px) {
    .bookmark-link--page-corner {
      top: calc(env(safe-area-inset-top, 0px) + 1.45rem);
      right: calc(env(safe-area-inset-right, 0px) + 1.7rem);
    }
  }

  .contact-link {
    display: inline-flex;
    align-items: center;
    gap: 0.48rem;
    border-radius: 0.72rem;
    border: 1px solid var(--surface-border);
    background: var(--surface-strong);
    color: var(--text-primary);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.52rem 0.84rem;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }

  .contact-link:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  @media (min-width: 640px) {
    .contact-link {
      font-size: 0.85rem;
      padding: 0.58rem 0.95rem;
    }
  }
</style>
