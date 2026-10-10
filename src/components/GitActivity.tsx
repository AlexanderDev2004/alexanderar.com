import { useQuery } from '@tanstack/react-query'
import {
  fetchActivityClient,
  GITHUB_USERNAME,
  type GitHubActivityData,
} from '../lib/github'
import githubSnapshot from '../data/github.json'
import { Icon } from "./Icon"
import { Skeleton } from "./Skeleton"

const INTENSITY_CLASS = ['', 'l1', 'l2', 'l3', 'l4'] as const

function Heatmap({ data }: { data: GitHubActivityData }) {
  return (
    <div
      className="heatmap"
      role="img"
      aria-label={`GitHub contributions, past 365 days, total ${data.totalContributions}`}
    >
      {data.weeks.flatMap((week, wi) =>
        week.days.map((day) => (
          <i
            key={`${wi}-${day.date}`}
            className={INTENSITY_CLASS[day.intensity] ?? ''}
            title={`${day.date} · ${day.contributionCount} contribution${
              day.contributionCount === 1 ? '' : 's'
            }`}
          />
        )),
      )}
    </div>
  )
}

export function GitActivity() {
  const initial = (githubSnapshot.activity ?? null) as GitHubActivityData | null

  const { data } = useQuery({
    queryKey: ['github-activity', GITHUB_USERNAME],
    // Silent client refresh — same contract as the old Svelte island:
    // build-time data renders instantly, the refresh swaps in the background.
    queryFn: () => fetchActivityClient(GITHUB_USERNAME),
    initialData: initial,
    staleTime: 24 * 60 * 60 * 1000,
  })

  if (!data || data.totalContributions === 0) {
    return (
      <div className="git-block">
        <div className="block-head">
          <Icon name="mdi:git" /> Git Activity
          <span className="right">last 365 days</span>
        </div>
        <Skeleton height={92} style={{ maxWidth: 560 }} />
      </div>
    )
  }

  return (
    <div className="git-block">
      <div className="block-head">
        <Icon name="mdi:git" /> Git Activity
        <span className="right">last 365 days</span>
      </div>
      <div className="activity">
        <Heatmap data={data} />
        <p className="stat">
          <b>{data.totalContributions.toLocaleString('en-US')}</b>
          contributions
        </p>
      </div>
    </div>
  )
}
