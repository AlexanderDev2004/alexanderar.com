<script>
  /**
   * Skeleton — Svelte port of shadcn/ui `skeleton`.
   * Placeholder while content is loading.
   *
   * Usage:
   *   <Skeleton className="h-[20px] w-[100px] rounded-full" />
   *
   * Props mirror the React version (`className` + rest forwarded via $$restProps).
   * `dir="rtl"` didukung otomatis (shimmer dibalik lewat CSS logical).
   */
  export let className = "";
  export let style = "";
</script>

<div
  data-slot="skeleton"
  aria-hidden="true"
  class="skeleton {className}"
  {style}
  {...$$restProps}
></div>

<style>
  .skeleton {
    /* setara bg-accent di shadcn, diselaraskan ke tema glass gelap repo ini */
    background: rgba(148, 163, 184, 0.18);
    border-radius: 0.375rem; /* rounded-md */
    animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    position: relative;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }

  /* Kilau halus menyapu — nonaktif otomatis jika user prefers-reduced-motion */
  .skeleton::after {
    content: "";
    position: absolute;
    inset-inline-start: -60%;
    top: 0;
    bottom: 0;
    width: 60%;
    background: linear-gradient(
      100deg,
      transparent 0%,
      rgba(255, 255, 255, 0.09) 45%,
      rgba(255, 255, 255, 0.16) 50%,
      rgba(255, 255, 255, 0.09) 55%,
      transparent 100%
    );
    animation: skeleton-shimmer 2.2s ease-in-out infinite;
  }

  /* Dukungan RTL: arah kilau mengikuti logical property (inset-inline-start).
     Tidak perlu CSS khusus — `inset-inline-start` otomatis mirror saat dir="rtl". */

  @keyframes skeleton-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.55;
    }
  }

  @keyframes skeleton-shimmer {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(280%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton,
    .skeleton::after {
      animation: none;
    }
  }
</style>
