import { createFileRoute, Link } from '@tanstack/react-router'
import { reports, formatDateShort } from '../lib/content'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/security-findings')({
  head: () =>
    seo({
      title: 'Security Findings - Alexander Agung Raya',
      description:
        'Responsible disclosure reports written by Alexander Agung Raya.',
      path: '/security-findings',
    }),
  component: SecurityFindingsPage,
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

function SecurityFindingsPage() {
  return (
    <div className="wrap">
      <header className="hero">
        <h1>
          Security <span className="sage">Findings</span>
        </h1>
        <p className="hero-sub">
          <iconify-icon icon="mdi:shield-lock-outline" />
          {reports.length} responsible disclosure report
          {reports.length === 1 ? '' : 's'}
        </p>
      </header>
      <section className="block-section">
        <div className="rows">
          {reports.map((report) => (
            <Link
              key={report.slug}
              to="/reports/$slug"
              params={{ slug: report.slug }}
              className="row-link"
            >
              <span className="t">
                <iconify-icon icon="mdi:chevron-right" />
                {report.title}
              </span>
              <span
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'baseline',
                  whiteSpace: 'nowrap',
                }}
              >
                <span className={severityClass(report.severity)}>{report.severity}</span>
                <span className="d" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--stone)' }}>
                  {formatDateShort(report.date)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
