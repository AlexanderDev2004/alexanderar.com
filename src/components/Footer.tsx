import { contacts } from '../data/contact'
import { files } from '../data/files'

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="links">
        {contacts.map((c) => (
          <a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-link"
          >
            <iconify-icon icon={c.icon} /> {c.label}
          </a>
        ))}
        {files.map((f) => (
          <a
            key={f.id}
            href={f.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-link"
          >
            <iconify-icon icon="mdi:file-pdf-box" /> {f.title}
          </a>
        ))}
      </div>
      <p>
        © {new Date().getFullYear()} Alexander Agung Raya{' '}
        <span className="heart">·</span> made with tanstack start · react ·
        tailwind
      </p>
    </footer>
  )
}
