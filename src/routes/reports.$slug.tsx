import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { formatDate, getReport } from '../lib/content'
import { seo } from '../lib/seo'
import { Icon } from "../components/Icon"

export const Route = createFileRoute('/reports/$slug')({
  head: (ctx) => {
    const report = getReport(ctx.params.slug)
    if (!report) return {}
    return seo({
      title: `${report.title} - Alexander Agung Raya`,
      description: `Security report — ${report.severity} · ${report.cwe} · ${report.owasp}`,
      path: `/reports/${report.slug}`,
      ogImage: `/og/reports/${report.slug}.png`,
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

function severityClass(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'sev sev-critical'
    case 'High':
      return 'sev sev-high'
    case 'Medium':
      return 'sev sev-medium'
    case 'Low':
      return 'sev sev-low'
    default:
      return 'sev'
  }
}

function ReportPage() {
  const { report } = useLoaderData({ from: '/reports/$slug' })

  return (
    <article className="article">
      <Link className="back" to="/security-findings">
        <Icon name="mdi:arrow-left" /> back to security findings
      </Link>
      <h1>{report.title}</h1>
      <div className="meta">
        <span className={severityClass(report.severity)}>{report.severity}</span>
        <span>{report.cwe}</span>
        <span>{report.owasp}</span>
        <span>
          <Icon name="mdi:calendar" /> {formatDate(report.date)}
        </span>
        <span>by {report.author}</span>
      </div>
      <div
        className="md-body"
        dangerouslySetInnerHTML={{ __html: report.html }}
      />
    </article>
  )
}
