import { Link } from '@tanstack/react-router'

export function Navigation() {
  return (
    <nav className="top-nav">
      <Link to="/" className="brand">
        alexanderar.com
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        <a href="/#work">Work</a>
        <a href="/#projects">Projects</a>
        <Link to="/blogs">Blogs</Link>
      </div>
    </nav>
  )
}
