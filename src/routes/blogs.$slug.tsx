import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { formatDate, getBlog } from '../lib/content'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/blogs/$slug')({
  head: (ctx) => {
    const post = getBlog(ctx.params.slug)
    if (!post) return {}
    return seo({
      title: `${post.title} - Alexander Agung Raya`,
      description: post.description,
      path: `/blogs/${post.slug}`,
      ogImage: `/og/blogs/${post.slug}.png`,
    })
  },
  component: BlogPostPage,
  loader: async ({ params }) => {
    const post = getBlog(params.slug)
    if (!post) {
      throw new Error(`Blog not found: ${params.slug}`)
    }
    return { post }
  },
})

function BlogPostPage() {
  const { post } = useLoaderData({ from: '/blogs/$slug' })

  return (
    <article className="article">
      <Link className="back" to="/blogs">
        <iconify-icon icon="mdi:arrow-left" /> back to all posts
      </Link>
      <h1>{post.title}</h1>
      <div className="meta">
        <span>
          <iconify-icon icon="mdi:calendar" /> {formatDate(post.date)}
        </span>
        {post.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
      <div
        className="md-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  )
}
