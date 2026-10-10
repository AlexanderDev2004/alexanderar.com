import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { getProject } from '../lib/content'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/projects/$slug')({
  head: (ctx) => {
    const project = getProject(ctx.params.slug)
    if (!project) return {}
    return seo({
      title: `${project.title} - Alexander Agung Raya`,
      description: project.description,
      path: `/projects/${project.slug}`,
      ogImage: `/og/projects/${project.slug}.png`,
    })
  },
  component: ProjectDetailPage,
  loader: async ({ params }) => {
    const project = getProject(params.slug)
    if (!project) {
      throw new Error(`Project not found: ${params.slug}`)
    }
    return { project }
  },
})

function ProjectDetailPage() {
  const { project } = useLoaderData({ from: '/projects/$slug' })

  return (
    <article className="article">
      <Link className="back" to="/projects">
        <iconify-icon icon="mdi:arrow-left" /> back to all projects
      </Link>
      <h1>
        {project.title}
        {project.year && (
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 16,
              color: 'var(--stone)',
              fontWeight: 400,
              marginLeft: 12,
              letterSpacing: 0,
            }}
          >
            {project.year}
          </span>
        )}
      </h1>
      <div className="meta">
        {project.technologies.map((tech) => (
          <span key={tech.name}>
            {tech.icon && <iconify-icon icon={tech.icon} />} {tech.name}
          </span>
        ))}
      </div>
      {(project.repoLink || project.projectLink) && (
        <div className="actions" style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          {project.repoLink && (
            <a
              className="btn btn-solid"
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <iconify-icon icon="mdi:github" /> Repo
            </a>
          )}
          {project.projectLink && (
            <a
              className="btn btn-out"
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <iconify-icon icon="mdi:open-in-new" /> Preview
            </a>
          )}
        </div>
      )}
      {project.image && <img className="cover" src={project.image} alt={project.title} decoding="async" />}
      <div
        className="md-body"
        dangerouslySetInnerHTML={{ __html: project.fullDescriptionHtml }}
      />
    </article>
  )
}
