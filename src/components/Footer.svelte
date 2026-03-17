
<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="container mx-auto px-4 sm:px-5 md:px-6 pb-6 md:pb-8 mt-10 md:mt-14">
  <div class="section-shell rounded-xl sm:rounded-2xl px-4 sm:px-5 md:px-6 py-4 md:py-5">
    <p class="text-center text-sm muted-text leading-relaxed">
      © {currentYear} crafted and maintained by
      <a href="https://github.com/AlexanderDev2004" class="footer-link">Alexander Agung Raya</a>
    </p>
  </div>
</footer>

<style>
  .footer-link {
    color: var(--accent);
    font-weight: 700;
    margin-left: 0.15rem;
  }

  .footer-link:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
</style>
