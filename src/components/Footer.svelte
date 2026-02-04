
<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="container mx-auto px-6 py-8 mt-16 border-t border-current border-opacity-10">
  <div class="text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400" style="font-family: 'Plus Jakarta Sans', sans-serif;">
      © {currentYear} developed by <a href="https://github.com/AlexanderDev2004" class="hover:underline font-semibold">Alexander Agung Raya</a>
    </p>
  </div>
</footer>

<style>
  footer {
    color-scheme: light dark;
    color: light-dark(#333, #ddd);
    background-color: light-dark(white, #0f0f0f);
  }
</style>
