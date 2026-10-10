import { createFileRoute } from '@tanstack/react-router'
import { ProjectsGrid } from '../components/ProjectsGrid'
import { projects } from '../lib/content'
import { seo } from '../lib/seo'
import { Icon } from "../components/Icon"

export const Route = createFileRoute('/projects/')({
  head: () =>
    seo({
      title: 'Projects - Alexander Agung Raya',
      description:
        'Games, web apps, and tools built by Alexander Agung Raya.',
      path: '/projects',
    }),
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div className="wrap">
      <header className="hero">
        <h1>
          All <span className="sage">Projects</span>
        </h1>
        <p className="hero-sub">
          <Icon name="mdi:folder-multiple-outline" />
          {projects.length} projects — games, web apps, and tools
        </p>
      </header>
      <section className="block-section">
        <ProjectsGrid items={projects} />
      </section>
    </div>
  )
}
