import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { getAdjacent, getProject, projects } from '../lib/content'
import { seo } from '../lib/seo'
import { Icon } from "../components/Icon"
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

/** How wide the cover is laid out: full width on phones, ~900px on desktop. */
const COVER_SIZES = '(max-width: 700px) 100vw, 900px'

/** Responsive sources for a cover: the 960px build variant plus the original. */
function coverSources(project: {
  image: string
  imageWidth?: number
  imageSmall?: { src: string; width: number }
}) {
  if (!project.imageSmall) return { srcSet: undefined, sizes: undefined }
  return {
    srcSet: `${project.imageSmall.src} ${project.imageSmall.width}w, ${project.image} ${project.imageWidth ?? 1920}w`,
    sizes: COVER_SIZES,
  }
}

/**
 * Project cover. The build-time content pipeline stores the image's intrinsic
 * size, so the frame reserves the exact final box (no layout shift) and the
 * photo paints as soon as the browser decodes it — the image sits above its
 * placeholder, so nothing waits for hydration to become visible.
 */
function CoverImage({ project }: { project: Project }) {
  const style =
    project.imageWidth && project.imageHeight
      ? { aspectRatio: `${project.imageWidth} / ${project.imageHeight}` }
      : undefined
  const { srcSet, sizes } = coverSources(project)

  return (
    <div className="cover-frame" style={style}>
      <img
        className="cover"
        src={project.imageSmall?.src ?? project.image}
        srcSet={srcSet}
        sizes={sizes}
        alt={project.title}
        width={project.imageWidth}
        height={project.imageHeight}
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}
