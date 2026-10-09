// Per-route head/meta helper — absolute URLs are built from the canonical
// site (alexanderar.com), matching the old Astro Layout behaviour.
export const SITE_URL = 'https://alexanderar.com'

/**
 * Bump when the generated OG images change their look: link-preview crawlers
 * (Discord, WhatsApp, iMessage…) cache aggressively by URL, so a version query
 * is the reliable way to make them re-fetch. YYMMDD of the last visual change.
 */
export const OG_IMAGE_VERSION = '261009'

function ogImageUrl(ogImage?: string) {
  return `${SITE_URL}${ogImage ?? '/og-image.png'}?v=${OG_IMAGE_VERSION}`
}

export interface SeoInput {
  title: string
  description: string
  /** Path like `/blogs/foo` — used for og:url and the default OG image. */
  path?: string
  /** Override the OG image (absolute path, e.g. `/og/blogs/foo.png`). */
  ogImage?: string
}

export function seo({ title, description, path = '/', ogImage }: SeoInput) {
  const image = ogImageUrl(ogImage)
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: `${SITE_URL}${path}` },
      { property: 'og:image', content: image },
      {
        name: 'twitter:title',
        content: title,
      },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  }
}
