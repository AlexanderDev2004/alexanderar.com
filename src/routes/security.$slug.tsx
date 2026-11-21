import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { formatDate, getReport } from '../lib/content'
import { seo } from '../lib/seo'
import { Icon } from '../components/Icon'
import { MarkdownBody } from '../components/MarkdownBody'

export const Route = createFileRoute('/security/$slug')({
  head: (ctx) => {
    const report = getReport(ctx.params.slug)
    if (!report) return {}
    return seo({
      title: `${report.title} - Alexander Agung Raya`,
      description: `Security report — ${report.severity} · ${report.cwe} · ${report.owasp}`,
      path: `/security/${report.slug}`,
      ogImage: `/og/security/${report.slug}.png`,
    })
  },
  component: ReportPage,
  loader: async ({ params }) => {
    const report = getReport(params.slug)
    if (!report) {
      throw new Error(`Report not found: ${params.slug}`)
    }
    return { report }
  },
})

const SEVERITY_RANK: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

function severityTone(severity: string): string {
  return SEVERITY_RANK[severity] ? `sev-${severity.toLowerCase()}` : ''
}

function ReportPage() {
  const { report } = useLoaderData({ from: '/security/$slug' })

  // The body headings come from the build step, so the list can only offer
  // links that actually resolve.
  const toc = [
    ...report.headings,
    ...(report.recommendedActions.length > 0
      ? [{ id: 'recommended-actions', text: 'Recommended actions' }]
      : []),
    ...(report.prompt ? [{ id: 'agent-prompt', text: 'Agent prompt' }] : []),
  ]

  return (
    <div className="wrap sec-doc">
      <Link className="sec-back" to="/security">
        <Icon name="mdi:arrow-left" /> back to security findings
      </Link>

      <div className="sec-doc-meta">
        <span>{report.cwe}</span>
        <span className="sep">·</span>
        <span>{report.owasp}</span>
        <span className="sep">·</span>
        <span>Responsible disclosure</span>
      </div>

      <h1>{report.title}</h1>

      <div className="sec-doc-sub">
        <span className={`sev ${severityTone(report.severity)}`}>{report.severity}</span>
        <span>{report.author}</span>
        <span className="sep">·</span>
        <span>{formatDate(report.date)}</span>
      </div>

      <div className="sec-doc-grid">
        <article className="sec-body">
          <MarkdownBody html={report.html} />
        </article>

        <aside className="sec-aside">
          <div className="sec-aside-sticky">
            <div className="sec-panel">
              <div className="sec-panel-label">At a glance</div>
              <div className="sec-glance-row">
                <span className="k">Severity</span>
                <span className={`v ${severityTone(report.severity)}`}>{report.severity}</span>
              </div>
              <div className="sec-glance-row">
                <span className="k">CWE</span>
                <span className="v">{report.cwe.replace(/^CWE-/, '')}</span>
              </div>
              <div className="sec-glance-row">
                <span className="k">OWASP</span>
                <span className="v">{report.owasp.replace(/^OWASP\s*/, '')}</span>
              </div>
              <div className="sec-glance-row">
                <span className="k">Published</span>
                <span className="v">{formatDate(report.date)}</span>
              </div>
              {report.pdf && (
                <>
                  <a
                    className="btn btn-out"
                    href={report.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="mdi:file-pdf-box" /> View full report (PDF)
                  </a>
                  <p className="sec-panel-note">
                    URLs and personal data are redacted in the public PDF.
                  </p>
                </>
              )}
            </div>

            {toc.length > 0 && (
              <div className="sec-panel sec-panel-toc">
                <div className="sec-panel-label">On this page</div>
                <nav className="sec-toc">
                  {toc.map((entry) => (
                    <a key={entry.id} href={`#${entry.id}`}>
                      {entry.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </aside>

        {report.recommendedActions.length > 0 && (
          <section className="sec-actions" id="recommended-actions">
            <div className="sec-actions-head">
              <span className="mark">
                <Icon name="mdi:shield-check-outline" />
              </span>
              <h2>Recommended actions</h2>
              <span className="count">{report.recommendedActions.length} steps</span>
            </div>
            <div className="sec-actions-body">
              {report.recommendedActions.map((action, index) => (
                <div className="sec-step" key={action.title}>
                  <span className="n">{index + 1}</span>
                  <div>
                    <h3>{action.title}</h3>
                    {action.detail && <p>{action.detail}</p>}
                  </div>
                </div>
              ))}
              {report.fix && (
                <div className="sec-fix">
                  <div className="sec-fix-bar">
                    <span>Fix · server-side ownership check</span>
                    <span>{report.fix.lang}</span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: report.fix.html }} />
                </div>
              )}
            </div>
          </section>
        )}

        {report.prompt && (
          <section className="sec-prompt" id="agent-prompt">
            <div className="sec-prompt-head">
              <div className="txt">
                <span className="mark">
                  <Icon name="mdi:console-line" />
                </span>
                <p>Use this prompt with an agent that can inspect your infrastructure.</p>
              </div>
              <CopyPromptButton text={report.prompt} />
            </div>
            <pre>{report.prompt}</pre>
          </section>
        )}
      </div>
    </div>
  )
}

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // clipboard API can be unavailable (http, permissions) — best effort
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      className={`sec-copy${copied ? ' copied' : ''}`}
      onClick={onClick}
      aria-label={copied ? 'Prompt copied' : 'Copy prompt to clipboard'}
    >
      <Icon name={copied ? 'mdi:check' : 'mdi:content-copy'} />
      {copied ? 'Copied' : 'Copy Prompt'}
    </button>
  )
}
