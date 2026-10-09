import type { ReactNode } from 'react'
import {
  Link,
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../styles/global.css'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'

/**
 * Module-scope QueryClient is safe here because the site is fully
 * prerendered: the build-time render never fetches (every query has
 * initialData + 24h staleTime), and each browser load gets a fresh
 * module instance anyway.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: 'Alexander Agung Raya - Software Developer',
      },
      {
        name: 'description',
        content:
          'Portfolio of Alexander Agung Raya, a Software Developer from Indonesia.',
      },
      { property: 'og:site_name', content: 'alexanderar.com' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Alexander Agung Raya - Software Developer',
      },
      {
        property: 'og:description',
        content:
          'Portfolio of Alexander Agung Raya, a Software Developer from Indonesia.',
      },
      {
        property: 'og:image',
        content: 'https://alexanderar.com/og-image.png',
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'icon', href: '/IconAlex.png' }],
    scripts: [
      {
        src: 'https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js',
      },
    ],
  }),
  component: RootComponent,
  // Fallback for client-side navigation to unknown paths.
  notFoundComponent: RootNotFound,
})

function RootNotFound() {
  return (
    <div className="article" style={{ textAlign: 'center', paddingTop: 120 }}>
      <p className="stat" style={{ marginBottom: 8 }}>
        <b style={{ fontSize: 56 }}>404</b>
      </p>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px' }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--body-muted)', marginTop: 10 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <p style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Link className="btn btn-solid" to="/">
          <iconify-icon icon="mdi:home" /> Back home
        </Link>
        <Link className="btn btn-out" to="/blogs">
          <iconify-icon icon="mdi:post-outline" /> Read the blog
        </Link>
      </p>
    </div>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
