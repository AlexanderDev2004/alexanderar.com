// Renders build-time markdown HTML with syntax-highlighted code blocks.
//
// content.json ships prose as ready-made HTML, where every fenced code block
// is `<pre><code class="language-x">…</code></pre>`. MarkdownBody splits that
// string into prose parts and code parts, highlights each code part with the
// shared TanStack Highlight highlighter (synchronous — identical output on
// the server and in the browser), and renders one compact markup tree per
// block: the token spans carry stable semantic classes (.th-comment,
// .th-keyword, …) that global.css themes with CSS variables, so a future
// dark theme only remaps variables and never changes the DOM.
import { useMemo, useEffect, useRef, useState } from 'react';
import { escapeHtml } from '@tanstack/highlight';
import { highlighter } from '../lib/highlight';
import { Icon } from './Icon';

interface HtmlPart {
  kind: 'html';
  html: string;
}

interface CodePart {
  kind: 'code';
  lang?: string;
  code: string;
}

type MdPart = HtmlPart | CodePart;

// remark-rehype emits exactly this shape for fenced and indented code blocks;
// entity-escaped code content can never contain a raw `</code>`, so a
// non-greedy match over the trusted build output is safe.
const CODE_BLOCK_RE = /<pre><code(?: class="language-([\w-]+)")?>([\s\S]*?)<\/code><\/pre>/g;

function decodeEntities(text: string): string {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

export function splitMarkdownHtml(html: string): MdPart[] {
  const parts: MdPart[] = [];
  let cursor = 0;
  for (const match of html.matchAll(CODE_BLOCK_RE)) {
    const prose = html.slice(cursor, match.index).trim();
    if (prose) parts.push({ kind: 'html', html: prose });
    parts.push({ kind: 'code', lang: match[1], code: decodeEntities(match[2]) });
    cursor = match.index + match[0].length;
  }
  const rest = html.slice(cursor).trim();
  if (rest) parts.push({ kind: 'html', html: rest });
  return parts;
}

function CopyCodeButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API can be unavailable (http, permissions) — best effort
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      className={`code-copy${copied ? ' copied' : ''}`}
      aria-label={copied ? 'Copied' : 'Copy code to clipboard'}
      onClick={onClick}
    >
      <Icon name={copied ? 'mdi:check' : 'mdi:content-copy'} />
    </button>
  );
}

function CodeBlock({ lang, code }: { lang?: string; code: string }) {
  const html = useMemo(() => {
    try {
      return highlighter.highlightToHtml(code, { lang });
    } catch {
      return `<pre class="th-code"><code>${escapeHtml(code)}</code></pre>`;
    }
  }, [lang, code]);

  return (
    <figure className="code-frame" data-code-lang={lang ?? 'text'}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <span className="code-lang" aria-hidden="true">
        {lang ?? 'text'}
      </span>
      <CopyCodeButton text={code} />
    </figure>
  );
}

export function MarkdownBody({ html }: { html: string }) {
  const parts = useMemo(() => splitMarkdownHtml(html), [html]);
  return (
    <div className="md-body">
      {parts.map((part, i) =>
        part.kind === 'code' ? (
          <CodeBlock key={i} lang={part.lang} code={part.code} />
        ) : (
          <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
        ),
      )}
    </div>
  );
}
