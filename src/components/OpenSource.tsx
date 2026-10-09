import { useQuery } from '@tanstack/react-query'
import {
  fetchPRsClient,
  GITHUB_USERNAME,
  type GitHubPRData,
  type RepositoryPRGroup,
} from '../lib/github'
import githubSnapshot from '../data/github.json'

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
  return (
    <section className="os-group">
      <div className="os-repo">
        <a
          className="os-repo-name"
          href={group.repository.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {group.repository.full_name}
          <iconify-icon icon="mdi:arrow-top-right" />
        </a>
        <div className="os-repo-meta">
          <span title={`${group.mergedCount} merged PRs`}>
            <iconify-icon icon="mdi:source-pull" />
            {group.mergedCount}
          </span>
          <span title={`${group.repository.stargazerCount} stars`}>
            <iconify-icon icon="mdi:star-outline" />
            {formatStars(group.repository.stargazerCount)}
          </span>
        </div>
        <span className="os-last">last merged {monthYear(group.lastMergedAt)}</span>
      </div>

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

  const grouped = data?.grouped ?? []
  const totalPRs = data?.totalPRs ?? 0

  return (
    <div className="block os">
      <div className="os-head">
        <span className="os-tick" />
        <h3>Open Source Contributions</h3>
      </div>
      <p className="os-sub">
        Merged pull requests in other people&rsquo;s projects over the last year, most
        recent first.
      </p>

      {grouped.length > 0 ? (
        <div className="os-card">
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
