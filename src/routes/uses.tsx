import { createFileRoute } from '@tanstack/react-router'
import { uses } from '../data/uses'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/uses')({
  head: () =>
    seo({
      title: 'Uses - Alexander Agung Raya',
      description:
        'Hardware, gadgets, and AI agents that Alexander Agung Raya uses day to day.',
      path: '/uses',
    }),
  component: UsesPage,
})

function UsesPage() {
  const totalItems = uses.reduce((sum, category) => sum + category.items.length, 0)

  return (
    <div className="wrap">
      <header className="hero">
        <h1>
          U<span className="sage">ses</span>
        </h1>
        <p className="hero-sub">
          <iconify-icon icon="mdi:toolbox-outline" />
          {totalItems} things I use day to day
        </p>
        <p className="hero-copy">
          Hardware and AI agents that help me build, learn, and get things done —
          inspired by <a href="https://uses.tech" target="_blank" rel="noopener noreferrer">uses.tech</a>.
        </p>
      </header>

      {uses.map((category) => (
        <section className="block-section" key={category.id}>
          <h2 className="section-title">
            <iconify-icon icon={category.icon} /> {category.title}
          </h2>
          <table className="uses-table">
            <tbody>
              {category.items.map((item) => (
                <tr key={item.name}>
                  <th scope="row">{item.name}</th>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
