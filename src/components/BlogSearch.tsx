import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { formatDateShort, type BlogPost } from '../lib/content'
import { Icon } from './Icon'

/** Highlight every case-insensitive occurrence of `term` inside `text`.
 *  Always returns an array so callers can .map() over it safely. */
function highlight(text: string, term: string) {
  if (!term) return [text]
  const parts: (string | { m: string })[] = []
  const lower = text.toLowerCase()
  const t = term.toLowerCase()
  let i = 0
  while (i < text.length) {
    const hit = lower.indexOf(t, i)
    if (hit < 0) {
      parts.push(text.slice(i))
      break
    }
    if (hit > i) parts.push(text.slice(i, hit))
    parts.push({ m: text.slice(hit, hit + term.length) })
    i = hit + term.length
  }
  return parts
}

export function BlogSearch({ posts }: { posts: BlogPost[] }) {
  const [raw, setRaw] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isTagMode = raw.trimStart().startsWith('#')
  const term = isTagMode ? raw.trim().slice(1).trim().toLowerCase() : raw.trim().toLowerCase()

  const allTags = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
    [posts],
  )
  const tagMatches = useMemo(
    () => (isTagMode ? allTags.filter((t) => t.includes(term)) : []),
    [isTagMode, allTags, term],
  )

  const filtered = useMemo(() => {
    if (isTagMode) {
      return posts.filter((p) => p.tags.some((tag) => tag.toLowerCase().includes(term)))
    }
    if (!term) return posts
    const q = term
    return posts.filter((p) =>
      (p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase().includes(q),
    )
  }, [posts, isTagMode, term])

  // "/" focuses the search box, Esc clears it and blurs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setRaw('')
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const searching = raw.trim().length > 0

  return (
    <div className="blog-search">
      <div className={isTagMode ? 'bs-box tagmode' : 'bs-box'}>
        <Icon name="mdi:magnify" />
        <input
          ref={inputRef}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Search posts…  (type # to filter by tag)"
          aria-label="Search blog posts"
          autoComplete="off"
          spellCheck={false}
        />
        {searching && (
          <button
            type="button"
            className="bs-clear"
            aria-label="Clear search"
            onClick={() => {
              setRaw('')
              inputRef.current?.focus()
            }}
          >
            <Icon name="mdi:close" />
          </button>
        )}
        {!searching && <kbd className="bs-kbd">/</kbd>}
        {isTagMode && <span className="bs-badge">tag filter</span>}
      </div>

      {isTagMode && tagMatches.length > 0 && (
        <div className="bs-tags">
          {tagMatches.map((t) => (
            <button
              key={t}
              type="button"
              className="bs-chip"
              onClick={() => {
                setRaw(`#${t} `)
                inputRef.current?.focus()
              }}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      <div className="bs-meta">
        <span>
          {filtered.length} of {posts.length} post{posts.length === 1 ? '' : 's'}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="rows">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              to="/blogs/$slug"
              params={{ slug: post.slug }}
              className="row-link"
            >
              <span className="t">
                {highlight(post.title, isTagMode ? '' : raw.trim()).map((part, i) =>
                  typeof part === 'string' ? (
                    part
                  ) : (
                    <mark key={i}>{part.m}</mark>
                  ),
                )}
              </span>
              <span className="d">
                <span className="read">
                  read <Icon name="mdi:arrow-right" />
                </span>
                {isTagMode && post.tags.some((t) => t.toLowerCase().includes(term)) && (
                  <span className="bs-row-tag">
                    {post.tags
                      .filter((t) => t.toLowerCase().includes(term))
                      .map((t) => `#${t}`)
                      .join(' ')}
                  </span>
                )}
                {formatDateShort(post.date)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bs-empty">
          <Icon name="mdi:magnify" />
          <p>
            No posts found for &ldquo;{raw.trim()}&rdquo;
            <br />
            try another keyword, or <b>#tag</b> like{' '}
            <button type="button" className="bs-chip" onClick={() => setRaw(`#${allTags[0]} `)}>
              #{allTags[0]}
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
