import { createFileRoute } from '@tanstack/react-router'
import { certifications } from '../data/certifications'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/certifications')({
  head: () =>
    seo({
      title: 'Certifications - Alexander Agung Raya',
      description: 'Certifications earned by Alexander Agung Raya.',
      path: '/certifications',
    }),
  component: CertificationsPage,
})

function CertificationsPage() {
  return (
    <div className="wrap">
      <header className="hero">
        <h1>
          Certi<span className="sage">fications</span>
        </h1>
        <p className="hero-sub">
          <iconify-icon icon="mdi:certificate-outline" />
          {certifications.length} certifie{certifications.length === 1 ? 'd program' : 'd programs'}
        </p>
      </header>
      <section className="block-section">
        <div className="grid-2">
          {certifications.map((cert) => (
            <article className="card" key={cert.id}>
              {cert.certificateImage && (
                <img
                  className="cert-image"
                  src={`/${cert.certificateImage}`}
                  alt={cert.title}
                  loading="lazy"
                />
              )}
              <h3 style={{ marginTop: 14 }}>
                {cert.title}
                <span className="year">{cert.year}</span>
              </h3>
              <p className="desc">{cert.description}</p>
              <div className="tags">
                {cert.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {cert.certificateLink && (
                <div className="actions">
                  <a
                    className="btn btn-out"
                    href={cert.certificateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <iconify-icon icon="mdi:open-in-new" /> View certificate
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
