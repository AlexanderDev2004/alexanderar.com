<script>
  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };
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
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Secret Bookmarks Link -->
        <a
          href="/bookmarks"
          title="Secret Bookmarks (Easter Egg)"
          class="p-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Secret Bookmarks"
        >
          <iconify-icon icon="mdi:bookmark" width="24" height="24"></iconify-icon>
        </a>

        <!-- <button
          class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
          on:click={toggleDarkMode}
        >
          <svg
            class="w-6 h-6 dark:hidden"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M21.64 10.64c-.18-1.34-.76-2.59-1.67-3.6-.9-1.01-2.16-1.64-3.56-1.85-1.4-.21-2.84.06-4.04.78-1.2.72-2.11 1.93-2.53 3.29-.42 1.36-.37 2.82.15 4.14.52 1.32 1.53 2.38 2.82 2.99 1.29.61 2.76.69 4.11.23 1.35-.46 2.47-1.4 3.1-2.65.63-1.25.71-2.72.38-4.14zm-2.04 2.07c-.38.73-.96 1.32-1.68 1.65-.73.33-1.55.38-2.34.14-.79-.24-1.47-.75-1.89-1.42-.42-.67-.58-1.49-.44-2.28.14-.79.54-1.51 1.13-2.02.59-.51 1.35-.79 2.13-.76.78.03 1.51.35 2.08.9.57.55.92 1.31.99 2.11.07.8-.15 1.6-.59 2.28z"
            />
          </svg>
          <svg
            class="w-6 h-6 hidden dark:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button> -->
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
