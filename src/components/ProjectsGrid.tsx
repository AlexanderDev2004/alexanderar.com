import { Link } from '@tanstack/react-router'
import type { Project } from '../lib/content'
import { Icon } from "./Icon"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="proj">
      <h3>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="card-link"
        >
          {project.title}
        </Link>
        {project.year && <span className="year">{project.year}</span>}
      </h3>
      <p className="desc">{project.description}</p>
      {project.technologies.length > 0 && (
        <div className="tags">
          {project.technologies.map((tech) => (
            <span className="tag" key={tech.name}>
              {tech.icon && <Icon name={tech.icon} />}
              {tech.name}
            </span>
          ))}
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

export function ProjectsGrid({ items }: { items: Project[] }) {
  return (
    <div className="proj-list">
      {items.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
