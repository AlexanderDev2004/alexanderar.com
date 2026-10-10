// Loading placeholder. Renders an empty block with the site's sage shimmer
// (see `.skeleton` in global.css) while async content — a lazy route chunk on
// SPA navigation, or a client-side data refresh — is still coming in.
//
// Purely visual: aria-hidden, wrapped by callers in a role="status" region
// (see PageSkeleton) so screen readers announce the loading state instead.
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
        <Skeleton width={260} height={36} radius={10} />
        <Skeleton width={420} height={13} />
        <Skeleton width={180} height={13} />
        <Skeleton height={96} radius={12} />
        <Skeleton height={96} radius={12} />
      </div>
    </main>
  );
}
