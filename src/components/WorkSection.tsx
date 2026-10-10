import { works, type WorkItem } from '../data/work'
import { Icon } from "./Icon"

/** "REMOTE" -> "Remote", "PART TIME" -> "Part-time", "ON-SITE" -> "On-site". */
function prettyStatus(status: string): string {
  const map: Record<string, string> = {
    'part time': 'Part-time',
    'part-time': 'Part-time',
    'full time': 'Full-time',
    'full-time': 'Full-time',
    'on site': 'On-site',
    'on-site': 'On-site',
    remote: 'Remote',
    internship: 'Internship',
  }
  return map[status.toLowerCase()] ?? status
}

function statusLine(work: WorkItem): string {
  return work.status.map(prettyStatus).join(' · ')
}

function period(work: WorkItem): string {
  return `${work.startDate} — ${work.endDate ?? 'Present'}`
}

export function WorkSection() {
  return (
    <div style={{ marginTop: 20 }}>
      {works.map((work) => (
        <details className="job" key={`${work.company}-${work.startDate}`} open>
          <summary>
            <h3>
              {work.jobTitle} <span className="co">· {work.company}</span>
            </h3>
            <span className="when">
              {period(work)} · {statusLine(work)}
            </span>
            <Icon className="chev" name="mdi:chevron-down" />
          </summary>
          <div className="body">
            <ul>
              {work.description.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {work.tags.length > 0 && (
              <div className="tags">
                {work.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
