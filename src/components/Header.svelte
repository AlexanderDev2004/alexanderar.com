<script lang="ts">
  import { contacts } from '../data/contact';
</script>

<header class="sticky top-0 z-50 transition-colors duration-300">
  <div class="container mx-auto px-4 sm:px-5 md:px-6 py-5 md:py-8">
    <div class="flex justify-between items-start mb-4 md:mb-6">
      <div class="flex-1">
        <a href="/" aria-label="Home" class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight" style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;">
          Alexander Agung Raya
        </a>

        <div class="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 mb-3 sm:mb-4 py-0.5">
          <span
            class="px-2.5 sm:px-3 py-1 border border-current rounded-full text-xs sm:text-sm"
            style="font-family: 'Plus Jakarta Sans', sans-serif;"
          >
            he/him/他
          </span>
        </div>

        <div class="space-y-1">
          <p
            class="text-base sm:text-lg"
            style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;"
          >
            Software Developer
          </p>
          <div class="flex items-center gap-2 text-sm sm:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill="currentColor"
                d="M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
              />
            </svg>
            <span style="font-family: 'Plus Jakarta Sans', sans-serif;">Indonesia, East Java</span>
          </div>

          <div class="flex flex-wrap gap-2 sm:gap-3 mt-4">
            {#each contacts as item}
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm font-medium"
                style="font-family: 'Plus Jakarta Sans', sans-serif;"
              >
                <iconify-icon icon={item.icon} width="16" height="16"></iconify-icon>
                <span>{item.label}</span>
              </a>
            {/each}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a
          href="/bookmarks"
          title="Secret Bookmarks"
          class="p-2 rounded-lg opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Secret Bookmarks"
        >
          <iconify-icon icon="mdi:bookmark" width="24" height="24"></iconify-icon>
        </a>
      </div>

    </div>

    <div class="h-px bg-current opacity-20 mb-4 md:mb-6"></div>
  </div>
</header>

<style>
  header {
    color-scheme: light dark;
    color: light-dark(black, white);
    background-color: light-dark(white, #0f0f0f);
  }
</style>
