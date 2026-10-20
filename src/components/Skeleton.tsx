// Loading placeholder. Renders an empty block with the site's sage shimmer
// (see `.skeleton` in global.css) while async content — a lazy route chunk on
// SPA navigation, a client-side data refresh, or a slow image — is still
// coming in.
//
// Purely visual: aria-hidden, wrapped by callers in a role="status" region
// (see PageSkeleton) so screen readers announce the loading state instead.
import { useState } from 'react';
import type { CSSProperties } from 'react';

interface SkeletonProps {
  /** Defaults to full width of the parent. */
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width, height = 14, radius = 8, className, style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className ?? ''}`}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

/** Multi-line text placeholder — the last line is shorter, like a paragraph. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={`skeleton-text ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

/**
 * Image-shaped placeholder. Fills the parent (give the parent the final
 * aspect ratio) so swapping in the real image causes zero layout shift.
 */
export function SkeletonImage({ radius = 8, className }: { radius?: number | string; className?: string }) {
  return <Skeleton width="100%" height="100%" radius={radius} className={`skeleton-img ${className ?? ''}`} />;
}

/** Card-shaped placeholder — mirrors .music-card: square art, two-line
 * title, artist line, meta line. Sized from a Playwright audit of the real
 * cards (2026-10): art + 10px gap, 19px title lines, 18px sub/meta, 2px
 * gaps, so the grid does not jump when the real cards replace it. */
export function SkeletonCard({ radius = 12 }: { radius?: number | string }) {
  return (
    <div className="skeleton-card" style={{ borderRadius: radius }} aria-hidden="true">
      <Skeleton width="100%" height="auto" radius={8} className="skeleton-img" />
      <Skeleton width="100%" height={19} radius={6} />
      <Skeleton width="88%" height={19} radius={6} />
      <Skeleton width="70%" height={18} radius={6} />
      <Skeleton width="45%" height={18} radius={6} className="skeleton-meta" />
    </div>
  );
}

/** Form-shaped placeholder — stacked label + field rows. */
export function SkeletonForm({ fields = 3 }: { fields?: number }) {
  return (
    <div className="skeleton-form" aria-hidden="true">
      {Array.from({ length: fields }, (_, i) => (
        <div className="skeleton-form-row" key={i}>
          <Skeleton width={90} height={11} />
          <Skeleton height={38} radius={10} />
        </div>
      ))}
      <Skeleton width={120} height={38} radius={10} />
    </div>
  );
}

/**
 * Image that shows a SkeletonImage until it finishes loading. The wrapper is
 * positioned and the skeleton overlays it, so the real image keeps its own
 * box (via its className) and nothing shifts when the pixels arrive.
 */
export function AsyncImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  radius = 8,
  className,
  fallback,
}: {
  src?: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  radius?: number | string
  className?: string
  /** Rendered instead of the skeleton when there is no src at all. */
  fallback?: React.ReactNode
}) {
  const [loaded, setLoaded] = useState(false)

  if (!src) {
    return <>{fallback ?? <SkeletonImage radius={radius} className={className} />}</>
  }

  return (
    <span className="async-img">
      {!loaded && <SkeletonImage radius={radius} className={className} />}
      <img
        className={className}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </span>
  )
}

/**
 * Page-shaped placeholder used as the router's defaultPendingComponent while
 * a lazy route chunk is fetched during client-side navigation. With
 * `defaultPreload: 'intent'` most navigations never show it — it only
 * appears when a link was not preloaded and the network is slow.
 */
export function PageSkeleton() {
  return (
    <main role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="page-skeleton">
        <Skeleton width="62%" height={64} radius={10} />
        <Skeleton width="44%" height={28} radius={8} />
        <Skeleton width="26%" height={30} radius={8} className="page-skeleton-title" />
        <div className="page-skeleton-cards">
          <Skeleton height={190} radius={12} />
          <Skeleton height={190} radius={12} />
          <Skeleton height={190} radius={12} />
          <Skeleton height={190} radius={12} />
        </div>
        <div className="page-skeleton-cards">
          <Skeleton height={190} radius={12} />
          <Skeleton height={190} radius={12} />
          <Skeleton height={190} radius={12} />
          <Skeleton height={190} radius={12} />
        </div>
      </div>
    </main>
  );
}
