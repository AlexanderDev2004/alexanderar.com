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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Jan 2026" -> year*12 + month index, tolerant of full month names. */
function monthIndex(ym: string): number {
  const [m, y] = ym.trim().split(' ');
  return Number(y) * 12 + MONTHS.indexOf(m.slice(0, 3));
}

/** Inclusive span in months, rendered LinkedIn-style: "6 mos", "1 yr 2 mos". */
function duration(work: WorkItem): string {
  const now = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const endIdx = work.endDate ? monthIndex(work.endDate) : monthIndex(now);
  const total = Math.max(1, endIdx - monthIndex(work.startDate) + 1);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} mos`);
  return parts.join(' ');
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
              {period(work)} · {duration(work)} · {statusLine(work)}
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
