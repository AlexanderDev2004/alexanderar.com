import { Link } from '@tanstack/react-router'
import { Icon } from './Icon'

interface Adjacent {
  slug: string
  title: string
}

/**
 * "Previous / Next" pager shown at the bottom of detail pages. Both sides
 * link one entry up/down the index list; a missing side (first/last entry)
 * renders as a quiet, disabled slot so the two columns stay balanced.
 */
export function PrevNext({
  basePath,
  prev,
  next,
}: {
  basePath: '/projects' | '/blogs'
  prev?: Adjacent
  next?: Adjacent
}) {
  return (
    <nav className="prev-next" aria-label="Adjacent entries">
      {prev ? (
        <Link
          className="pn-link pn-prev"
          to={`${basePath}/$slug`}
          params={{ slug: prev.slug }}
        >
          <Icon name="mdi:arrow-left" />
          <span className="pn-body">
            <span className="pn-label">Previous</span>
            <span className="pn-title">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span className="pn-link pn-empty" aria-hidden="true" />
      )}

      {next ? (
        <Link
          className="pn-link pn-next"
          to={`${basePath}/$slug`}
          params={{ slug: next.slug }}
        >
          <span className="pn-body">
            <span className="pn-label">Next</span>
            <span className="pn-title">{next.title}</span>
          </span>
          <Icon name="mdi:arrow-right" />
        </Link>
      ) : (
        <span className="pn-link pn-empty" aria-hidden="true" />
      )}
    </nav>
  )
}
