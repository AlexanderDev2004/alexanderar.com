// Renders build-time markdown HTML. content.json already carries finished
// prose AND syntax-highlighted code (scripts/generate-content.mjs highlights
// every fenced block at build time), so this component only has to add the
// interactive chrome around code blocks: the frame, the language label, and
// the copy button. Nothing here tokenizes anything, which keeps hydration
// cheap on long pages.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './Icon'

interface HtmlPart {
  kind: 'html'
  html: string
}

interface CodePart {
  kind: 'code'
  lang?: string
  /** The highlighted `<pre class="th-code">…</pre>` markup, verbatim. */
  html: string
}

type MdPart = HtmlPart | CodePart

// The highlighter's own output shape, carrying the fence language.
const CODE_BLOCK_RE = /<pre class="th-code[^"]*"([^>]*)>[\s\S]*?<\/pre>/g
const LANG_RE = /data-language="([\w-]+)"/

export function splitMarkdownHtml(html: string): MdPart[] {
  const parts: MdPart[] = []
  let cursor = 0
  for (const match of html.matchAll(CODE_BLOCK_RE)) {
    const prose = html.slice(cursor, match.index).trim()
    if (prose) parts.push({ kind: 'html', html: prose })
    parts.push({ kind: 'code', lang: LANG_RE.exec(match[1])?.[1], html: match[0] })
    cursor = match.index + match[0].length
  }
  const rest = html.slice(cursor).trim()
  if (rest) parts.push({ kind: 'html', html: rest })
  return parts
}

function CopyCodeButton({ frame }: { frame: React.RefObject<HTMLElement | null> }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = async () => {
    // Read the text from the rendered block instead of shipping a second copy
    // of every snippet in the markup.
    const text = frame.current?.querySelector('pre')?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // clipboard API can be unavailable (http, permissions) — best effort
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      className={`code-copy${copied ? ' copied' : ''}`}
      aria-label={copied ? 'Copied' : 'Copy code to clipboard'}
      onClick={onClick}
    >
      <Icon name={copied ? 'mdi:check' : 'mdi:content-copy'} />
    </button>
  )
}

function CodeBlock({ lang, html }: { lang?: string; html: string }) {
  const frameRef = useRef<HTMLElement>(null)
  return (
    <figure className="code-frame" data-code-lang={lang ?? 'text'} ref={frameRef}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <span className="code-lang" aria-hidden="true">
        {lang ?? 'text'}
      </span>
      <CopyCodeButton frame={frameRef} />
    </figure>
  )
}

export function MarkdownBody({ html }: { html: string }) {
  const parts = useMemo(() => splitMarkdownHtml(html), [html])
  return (
    <div className="md-body">
      {parts.map((part, i) =>
        part.kind === 'code' ? (
          <CodeBlock key={i} lang={part.lang} html={part.html} />
        ) : (
          <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
        ),
      )}
    </div>
  )
}
