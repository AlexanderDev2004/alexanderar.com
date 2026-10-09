import { useQuery } from '@tanstack/react-query'
import {
  fetchPRsClient,
  GITHUB_USERNAME,
  type GitHubPRData,
} from '../lib/github'
import githubSnapshot from '../data/github.json'

/** Open Source as a collapsible dropdown (approved design). */
export function OpenSource() {
  // The snapshot is a build artifact produced by scripts/fetch-github.mjs;
  // its JSON-inferred types are structurally compatible but looser, so cast.
  const initial = githubSnapshot.prs as unknown as GitHubPRData

  const { data } = useQuery<GitHubPRData | null>({
    queryKey: ['github-prs', GITHUB_USERNAME],
    // Silent client refresh — build-time snapshot renders instantly,
    // fresh PR data swaps in only when non-empty (anti-flicker, same rule
    // as the old Svelte island).
    queryFn: () => fetchPRsClient(GITHUB_USERNAME),
    initialData: initial,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const grouped = data?.grouped ?? []
  const totalPRs = data?.totalPRs ?? 0

  return (
    <details className="block">
      <summary>
        <div className="block-head">
          <iconify-icon icon="mdi:source-pull" /> Open Source
          <span className="right">
            {totalPRs} merged PR{totalPRs === 1 ? '' : 's'} · last 365 days
          </span>
          <iconify-icon className="chev" icon="mdi:chevron-down" />
        </div>
      </summary>
      <div className="body">
        <p className="stat" style={{ marginBottom: 12 }}>
          merged by other maintainers
        </p>
        {grouped.length > 0 ? (
          <div className="chips">
            {grouped.map((group) => (
              <a
                key={group.repository.full_name}
                className="chip"
                href={group.repository.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <iconify-icon icon="mdi:source-repository" />
                {group.repository.name}
                <span className="count">×{group.mergedCount}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="skeleton" style={{ height: 30, maxWidth: 420 }} />
        )}
      </div>
    </details>
  )
}
