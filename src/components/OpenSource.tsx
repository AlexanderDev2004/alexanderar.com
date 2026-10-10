import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  EXCLUDED_REPOS,
  fetchPRsClient,
  GITHUB_USERNAME,
  type GitHubPRData,
  type RepositoryPRGroup,
} from '../lib/github'
import githubSnapshot from '../data/github.json'
import { Icon } from "./Icon"

function formatStars(count: number): string {
  if (count >= 1000) {
    const k = count / 1000
    return `${k >= 10 || count % 1000 === 0 ? Math.round(k) : k.toFixed(1)}k`
  }
  return String(count)
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function shortDate(iso: string): string {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

function RepoGroup({ group }: { group: RepositoryPRGroup }) {
  // Collapsed by default — matches the approved reference (caret v = closed).
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen((v) => !v)

  return (
    <section className="os-group">
      <div
        className="os-repo"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
      >
        <a
          className="os-repo-name"
          href={group.repository.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {group.repository.full_name}
          <Icon name="mdi:arrow-top-right" />
        </a>
        <div className="os-repo-meta">
          <span title={`${group.mergedCount} merged PRs`}>
            <Icon name="mdi:source-pull" />
            {group.mergedCount}
          </span>
          <span title={`${group.repository.stargazerCount} stars`}>
            <Icon name="mdi:star-outline" />
            {formatStars(group.repository.stargazerCount)}
          </span>
        </div>
        <Icon className="os-caret" name="mdi:chevron-down" />
        <span className="os-last">
          <Icon name="mdi:source-merge" title="Merged pull request" />
          last merged {monthYear(group.lastMergedAt)}
        </span>
      </div>

      {open && (
        <ul className="os-prs">
          {group.prs.map((pr) => (
            <li key={pr.number}>
              <div className="os-line">
                <a
                  className="os-pr-title"
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pr.title}
                </a>
                <span className="os-diff">
                  {pr.additions !== undefined && <span className="add">+{pr.additions}</span>}
                  {pr.deletions !== undefined && <span className="del">-{pr.deletions}</span>}
                </span>
              </div>
              <div className="os-line os-line-sub">
                <span className="os-pr-sub">
                  #{pr.number} • merged {shortDate(pr.merged_at)}
                </span>
                {pr.changedFiles !== undefined && (
                  <span className="os-files">
                    {pr.changedFiles} {pr.changedFiles === 1 ? 'file' : 'files'}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** Open Source Contributions card (elianiva-style PR list, approved reference). */
export function OpenSource() {
  // The snapshot is a build artifact produced by scripts/fetch-github.mjs;
  // its JSON-inferred types are structurally compatible but looser, so cast.
  const initial = githubSnapshot.prs as unknown as GitHubPRData

  const { data } = useQuery<GitHubPRData | null>({
    queryKey: ['github-prs', GITHUB_USERNAME],
    // Silent client refresh — build-time snapshot renders instantly,
    // fresh PR data swaps in only when non-empty (anti-flicker).
    queryFn: () => fetchPRsClient(GITHUB_USERNAME),
    initialData: initial,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const grouped = (data?.grouped ?? []).filter(
    (group) => !EXCLUDED_REPOS.has(group.repository.full_name),
  )
  const totalPRs = grouped.reduce((sum, g) => sum + g.mergedCount, 0)

  return (
    <div className="os-block">
      <div className="os-head">
        <span className="os-tick" />
        <h3>Open Source Contributions</h3>
      </div>
      <p className="os-sub">
        Merged pull requests in other people&rsquo;s projects over the last year, most
        recent first.
      </p>

      {grouped.length > 0 ? (
        <div className="os-list">
          {grouped.map((group) => (
            <RepoGroup key={group.repository.full_name} group={group} />
          ))}
          <div className="os-foot">
            {totalPRs} merged pull request{totalPRs === 1 ? '' : 's'} across{' '}
            {grouped.length} project{grouped.length === 1 ? '' : 's'}
          </div>
        </div>
      ) : (
        <div className="skeleton" style={{ height: 120, maxWidth: 560 }} />
      )}
    </div>
  )
}
