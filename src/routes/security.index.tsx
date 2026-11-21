import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { reports, formatDateShort, type Report } from '../lib/content'
import { seo } from '../lib/seo'
import { Icon } from '../components/Icon'

export const Route = createFileRoute('/security/')({
  head: () =>
    seo({
      title: 'Security Findings - Alexander Agung Raya',
      description:
        'Responsible disclosure reports written by Alexander Agung Raya.',
      path: '/security/',
      ogImage: '/og/security.png',
    }),
  component: SecurityFindingsPage,
})

/** Critical first — the order the "Sort by severity" option produces. */
const SEVERITY_RANK: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

function severityTone(severity: string): string {
  return SEVERITY_RANK[severity] ? `sev-${severity.toLowerCase()}` : ''
}

type SortKey = 'new' | 'old' | 'severity'

function SecurityFindingsPage() {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState<SortKey>('new')
  const searchRef = useRef<HTMLInputElement>(null)

  const years = useMemo(
    () => [...new Set(reports.map((report) => report.date.slice(0, 4)))].sort().reverse(),
    [],
  )

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const matches = reports.filter((report) => {
      if (severity && report.severity !== severity) return false
      if (year && !report.date.startsWith(year)) return false
      if (!term) return true
      return [report.title, report.summary, report.cwe, report.owasp, ...report.tags]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
    if (sort === 'old') return [...matches].reverse()
    if (sort === 'severity') {
      return [...matches].sort(
        (a, b) => (SEVERITY_RANK[b.severity] ?? 0) - (SEVERITY_RANK[a.severity] ?? 0),
      )
    }
    return matches
  }, [query, severity, year, sort])

  // "/" jumps to the search box, which is what the hint in the field promises.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const criticalCount = reports.filter((report) => report.severity === 'Critical').length
  const latest = reports[0]
  const filtered = query !== '' || severity !== '' || year !== '' || sort !== 'new'

  const clearFilters = () => {
    setQuery('')
    setSeverity('')
    setYear('')
    setSort('new')
  }

  return (
    <div className="wrap">
      <header className="hero sec-hero">
        <span className="sec-eyebrow">
          <span className="dot" />
          Security <span className="sep">/</span> Responsible disclosure
        </span>
        <h1>
          Security <span className="sage">Findings</span>
        </h1>
        <p className="sec-lede">
          Every vulnerability I have reported and disclosed. Search by CWE, product
          or keyword, or filter by severity and year.
        </p>

        <div className="sec-stats">
          <div className="sec-stat">
            <span className="k">Published</span>
            <span className="v">{reports.length}</span>
          </div>
          <div className="sec-stat">
            <span className="k">Critical</span>
            <span className="v critical">{criticalCount}</span>
          </div>
          <div className="sec-stat">
            <span className="k">Latest</span>
            <span className="v">{latest ? formatDateShort(latest.date) : '—'}</span>
          </div>
        </div>
      </header>

      <form
        className="sec-filters"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="sec-field sec-field-search">
          <label htmlFor="security-search">Search</label>
          <div className="sec-search">
            <Icon name="mdi:magnify" />
            <input
              id="security-search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="CWE, product or keyword"
              autoComplete="off"
            />
            <span className="sec-kbd" aria-hidden="true">
              /
            </span>
          </div>
        </div>

        <div className="sec-field">
          <label htmlFor="security-severity">Severity</label>
          <div className="sec-select">
            <select
              id="security-severity"
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
            >
              <option value="">All</option>
              {Object.keys(SEVERITY_RANK).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <Icon name="mdi:chevron-down" />
          </div>
        </div>

        <div className="sec-field">
          <label htmlFor="security-year">Year</label>
          <div className="sec-select">
            <select
              id="security-year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="">All</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <Icon name="mdi:chevron-down" />
          </div>
        </div>

        <div className="sec-field">
          <label htmlFor="security-sort">Sort by</label>
          <div className="sec-select">
            <select
              id="security-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
            >
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
              <option value="severity">Severity</option>
            </select>
            <Icon name="mdi:chevron-down" />
          </div>
        </div>

        <button
          type="button"
          className="sec-clear sec-field-clear"
          onClick={clearFilters}
          disabled={!filtered}
        >
          Clear filters
        </button>
      </form>

      <div className="sec-meta">
        <span className="live">
          <i />
          Feed
        </span>
        <span aria-live="polite">
          {visible.length} {visible.length === 1 ? 'finding' : 'findings'}
        </span>
      </div>

      <div className="sec-feed">
        {visible.map((report) => (
          <ReportCard key={report.slug} report={report} />
        ))}
        {visible.length === 0 && (
          <p className="sec-empty">
            No findings match <b>that filter</b>.
          </p>
        )}
      </div>

      <div className="sec-foot-note">
        <span>Disclosed under responsible disclosure · no user data published</span>
      </div>
    </div>
  )
}

function ReportCard({ report }: { report: Report }) {
  const tone = severityTone(report.severity)
  return (
    <Link
      to="/security/$slug"
      params={{ slug: report.slug }}
      className="sec-card"
    >
      <span className="top">
        <span>{report.cwe || 'Security'}</span>
        <span className="when">{formatDateShort(report.date)}</span>
      </span>
      <h2>{report.title}</h2>
      {report.summary && <p className="desc">{report.summary}</p>}
      <span className="foot">
        {report.tags.slice(0, 2).map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
        <span className="more">
          Read report <Icon name="mdi:arrow-right" />
        </span>
      </span>
      <span className={`sec-sev ${tone} lvl-${SEVERITY_RANK[report.severity] ?? 0}`}>
        <span className="label">Severity</span>
        <span className="word">{report.severity}</span>
        <span className="meter" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>
    </Link>
  )
}
