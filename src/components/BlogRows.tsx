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
          <span className="t">{post.title}</span>
          <span className="d">
            <span className="read">
              read <iconify-icon icon="mdi:arrow-right" />
            </span>
            {formatDateShort(post.date)}
          </span>
        </Link>
      ))}
    </div>
  )
}
