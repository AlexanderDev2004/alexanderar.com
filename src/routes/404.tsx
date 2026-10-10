import { createFileRoute, Link } from '@tanstack/react-router'
import { seo } from '../lib/seo'
import { Icon } from "../components/Icon"

export const Route = createFileRoute('/404')({
  head: () =>
    seo({
      title: '404 - Page not found',
      description: 'The page you are looking for does not exist.',
      path: '/404',
    }),
  component: NotFoundPage,
})

function NotFoundPage() {
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
          <Icon name="mdi:home" /> Back home
        </Link>
        <Link className="btn btn-out" to="/blogs">
          <Icon name="mdi:post-outline" /> Read the blog
        </Link>
      </p>
    </div>
  )
}
