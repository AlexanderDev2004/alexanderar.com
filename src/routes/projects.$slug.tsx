import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { getAdjacent, getProject, projects } from '../lib/content'
import { seo } from '../lib/seo'
import { Icon } from "../components/Icon"
import { Skeleton } from '../components/Skeleton'
import { PrevNext } from '../components/PrevNext'

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
  const { prev, next } = getAdjacent(projects, project.slug)

  return (
    <article className="article">
      <Link className="back" to="/projects">
        <Icon name="mdi:arrow-left" /> back to all projects
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
        {project.technologies.map((tech) => {
          const item = (
            <>
              {tech.icon && <Icon name={tech.icon} />} {tech.name}
            </>
          )
          return tech.docLink ? (
            <a
              key={tech.name}
              href={tech.docLink}
              target="_blank"
              rel="noopener noreferrer"
              title={`${tech.name} — official site`}
            >
              {item}
            </a>
          ) : (
            <span key={tech.name}>{item}</span>
          )
        })}
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
      )}
      <CoverImage project={project} />
      <div
        className="md-body"
        dangerouslySetInnerHTML={{ __html: project.fullDescriptionHtml }}
      />
      <PrevNext
        basePath="/projects"
        prev={prev && { slug: prev.slug, title: prev.title }}
        next={next && { slug: next.slug, title: next.title }}
      />
    </article>
  )
}

/**
 * Project cover. The build-time content pipeline stores the image's intrinsic
 * size, so the frame reserves the exact final box: the skeleton fills it while
 * the file is in flight and the photo fades in without any layout shift.
 */
function CoverImage({ project }: { project: { image: string; imageWidth?: number; imageHeight?: number; title: string } }) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // If the image finished loading before hydration attached onLoad (fast
  // cache, prerendered HTML), React never sees the event — check up front.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  const style =
    project.imageWidth && project.imageHeight
      ? { aspectRatio: `${project.imageWidth} / ${project.imageHeight}` }
      : undefined

  return (
    <div className="cover-frame" style={style}>
      {!loaded && <Skeleton className="cover-skeleton" />}
      <img
        ref={ref}
        className={`cover${loaded ? ' is-loaded' : ''}`}
        src={project.image}
        alt={project.title}
        width={project.imageWidth}
        height={project.imageHeight}
        decoding="async"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
