import { createFileRoute } from '@tanstack/react-router'
import { BlogRows } from '../components/BlogRows'
import { blogs } from '../lib/content'
import { seo } from '../lib/seo'
import { Icon } from "../components/Icon"

export const Route = createFileRoute('/blogs/')({
  head: () =>
    seo({
      title: 'Blogs - Alexander Agung Raya',
      description:
        'Notes and write-ups about development, games, and experiments by Alexander Agung Raya.',
      path: '/blogs',
    }),
  component: BlogsPage,
})

function BlogsPage() {
  return (
    <div className="wrap">
      <header className="hero">
        <h1>
          Writing <span className="thin" style={{ color: 'var(--stone)', fontWeight: 600 }}>&amp; Notes</span>
        </h1>
        <p className="hero-sub">
          <Icon name="mdi:post-outline" />
          {blogs.length} post{blogs.length === 1 ? '' : 's'} — from build logs to
          longer experiments
        </p>
      </header>
      <section className="block-section">
        <BlogRows posts={blogs} />
      </section>
    </div>
  )
}
