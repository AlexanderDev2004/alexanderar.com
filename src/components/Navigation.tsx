import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Icon } from './Icon'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects/', label: 'Projects' },
  { to: '/blogs/', label: 'Blogs' },
  { to: '/music/', label: 'Music' },
  { to: '/uses/', label: 'Uses' },
] as const

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Close the menu whenever a navigation happens.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <nav className="top-nav">
      <div className="nav-row">
        <Link to="/" className="brand">
          alexanderar.com
        </Link>
        <button
          type="button"
          className="nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'mdi:close' : 'mdi:menu'} />
        </button>
        <div className={open ? 'links open' : 'links'} onClick={() => setOpen(false)}>
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
