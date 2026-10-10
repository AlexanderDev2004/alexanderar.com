import { createFileRoute } from '@tanstack/react-router'
import { WorkSection } from '../components/WorkSection'
import { ProjectsGrid } from '../components/ProjectsGrid'
import { GitActivity } from '../components/GitActivity'
import { OpenSource } from '../components/OpenSource'
import { BlogRows } from '../components/BlogRows'
import { blogs, projects } from '../lib/content'
import { seo } from '../lib/seo'
import { contacts } from '../data/contact'
import { files } from '../data/files'
import { Icon } from "../components/Icon"

const SELECTED_PROJECT_COUNT = 4
const LATEST_BLOG_COUNT = 4

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: 'Alexander Agung Raya - Software Developer',
      description:
        'Portfolio of Alexander Agung Raya, a Software Developer from Indonesia.',
      path: '/',
    }),
  component: Home,
})

function Home() {
  const selectedProjects = projects.slice(0, SELECTED_PROJECT_COUNT)
  const latestBlogs = blogs.slice(0, LATEST_BLOG_COUNT)

  return (
    <div className="wrap">
      <header className="hero">
        <div className="hero-head">
          <h1>
            Alexander <span className="sage">Agung</span> Raya
          </h1>
          <a
            className="hero-avatar"
            href="https://github.com/AlexanderDev2004"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub profile"
            title="GitHub Profile"
          >
            <img
              src="/IconAlex.png"
              alt="Alexander avatar"
              width={84}
              height={84}
              loading="eager"
              decoding="async"
            />
          </a>
        </div>
        <p className="hero-sub">
          <Icon name="mdi:map-marker" />
          Software Developer — Indonesia, East Java
        </p>
        <p className="hero-copy">
          Software engineer based in Indonesia with hands-on experience
          building and maintaining scalable software systems. I enjoy exploring
          different technologies and solving real-world problems through clean,
          efficient, and maintainable solutions.
        </p>
        <div className="hero-links">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name={c.icon} />
              {c.label.toUpperCase()}
            </a>
          ))}
          {files.map((f) => (
            <a key={f.id} href={f.fileUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="mdi:file-pdf-box" />
              {f.title.toUpperCase()}
            </a>
          ))}
        </div>
      </header>

      <section className="block-section" id="work">
        <h2 className="section-title">Work Experience</h2>
        <WorkSection />
      </section>

      <section className="block-section" id="projects">
        <h2 className="section-title">Selected Projects</h2>
        <ProjectsGrid items={selectedProjects} />
        {projects.length > selectedProjects.length && (
          <p style={{ marginTop: 18 }}>
            <a className="underline-link" href="/projects">
              <Icon name="mdi:arrow-right" /> All projects
            </a>
          </p>
        )}
      </section>

      <section className="block-section" id="activity">
        <h2 className="section-title">
          Git Activity <span className="thin">&amp; Open Source</span>
        </h2>
        <GitActivity />
        <OpenSource />
      </section>

      <section className="block-section" id="blogs">
        <h2 className="section-title">Writing</h2>
        <BlogRows posts={latestBlogs} />
        {blogs.length > latestBlogs.length && (
          <p style={{ marginTop: 18 }}>
            <a className="btn btn-out" href="/blogs">
              <Icon name="mdi:arrow-right" /> All posts
            </a>
          </p>
        )}
      </section>
    </div>
  )
}
