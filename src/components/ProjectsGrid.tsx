import { Link } from '@tanstack/react-router'
import type { Project } from '../lib/content'
import { Icon } from "./Icon"

export function ProjectCard({
  project,
  headingLevel = 3,
}: {
  project: Project
  headingLevel?: 2 | 3
}) {
  // Index pages list projects as top-level content (h2 under the page h1);
  // the home page nests them under its "Selected Projects" h2, so h3 there.
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className="proj">
      <Heading>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="card-link"
        >
          {project.title}
        </Link>
        {project.year && <span className="year">{project.year}</span>}
      </Heading>
      <p className="desc">{project.description}</p>
      {project.technologies.length > 0 && (
        <div className="tags">
          {project.technologies.map((tech) => {
            const tag = (
              <>
                {tech.icon && <Icon name={tech.icon} />}
                {tech.name}
              </>
            )
            return tech.docLink ? (
              <a
                className="tag"
                key={tech.name}
                href={tech.docLink}
                target="_blank"
                rel="noopener noreferrer"
                title={`${tech.name} — official site`}
              >
                {tag}
                {/* Keeps the chip label short but gives the link a real name:
                    a bare "Go" or "C" reads as a generic link. */}
                <span className="sr-only"> — official site</span>
              </a>
            ) : (
              <span className="tag" key={tech.name}>
                {tag}
              </span>
            )
          })}
        </div>
      )}
      <div className="actions">
        {project.repoLink && (
          <a
            className="btn btn-solid"
            href={project.repoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="mdi:github" /> Repo
          </a>
        )}
        {project.projectLink && (
          <a
            className="btn btn-out"
            href={project.projectLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="mdi:open-in-new" /> Preview
          </a>
        )}
      </div>
    </article>
  )
}

export function ProjectsGrid({ items, headingLevel }: { items: Project[]; headingLevel?: 2 | 3 }) {
  return (
    <div className="proj-list">
      {items.map((project) => (
        <ProjectCard key={project.slug} project={project} headingLevel={headingLevel} />
      ))}
    </div>
  )
}
