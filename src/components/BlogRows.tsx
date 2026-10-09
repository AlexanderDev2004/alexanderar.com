import { Link } from '@tanstack/react-router'
import { formatDateShort, type BlogPost } from '../lib/content'

export function BlogRows({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="rows">
      {posts.map((post) => (
        <Link
          key={post.slug}
          to="/blogs/$slug"
          params={{ slug: post.slug }}
          className="row-link"
        >
          <span className="t">
            <iconify-icon icon="mdi:chevron-right" />
            {post.title}
          </span>
          <span className="d">{formatDateShort(post.date)}</span>
        </Link>
      ))}
    </div>
  )
}
