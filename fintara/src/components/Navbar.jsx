import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

const navCSS = `
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--accent-bright);
    letter-spacing: -.02em;
    z-index: 101;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    font-size: .9rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition);
  }
  .nav-links a:hover { color: var(--text-primary); }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: .75rem;
    z-index: 101;
  }

  .theme-toggle {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: .35rem .55rem;
    cursor: pointer;
    font-size: .95rem;
    line-height: 1;
    transition: border-color var(--transition);
  }
  .theme-toggle:hover { border-color: var(--accent); }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: .45rem 1.1rem;
    font-family: var(--font-body);
    font-size: .85rem;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition);
  }
  .btn-ghost:hover {
    border-color: var(--accent);
    color: var(--text-primary);
  }

  .btn-primary {
    background: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 10px;
    padding: .45rem 1.1rem;
    font-family: var(--font-body);
    font-size: .85rem;
    font-weight: 600;
    color: var(--bg-primary);
    cursor: pointer;
    transition: all var(--transition);
  }
  .btn-primary:hover {
    background: var(--accent-bright);
    border-color: var(--accent-bright);
  }

  /* ── hamburger button ── */
  .nav-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: .4rem .5rem;
    cursor: pointer;
    z-index: 101;
    transition: border-color var(--transition);
  }
  .nav-hamburger:hover { border-color: var(--accent); }
  .nav-hamburger span {
    display: block;
    width: 18px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all .3s ease;
  }
  .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── mobile drawer ── */
  .nav-drawer {
    display: none;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    padding: 1.25rem 1.5rem 1.5rem;
    z-index: 99;
    flex-direction: column;
    gap: 0;
    box-shadow: 0 8px 32px rgba(0,0,0,.12);
  }
  .nav-drawer.open { display: flex; }

  .nav-drawer .nav-links {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    width: 100%;
    margin-bottom: 1.25rem;
  }
  .nav-drawer .nav-links li {
    width: 100%;
    border-bottom: 1px solid var(--border);
  }
  .nav-drawer .nav-links li:last-child { border-bottom: none; }
  .nav-drawer .nav-links a {
    display: block;
    padding: .85rem 0;
    font-size: 1rem;
  }

  .nav-drawer-actions {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding-top: .5rem;
    flex-wrap: wrap;
  }

  /* ── breakpoints ── */
  @media (max-width: 768px) {
    .navbar { padding: 0 1.25rem; }
    .nav-hamburger { display: flex; }
    .navbar > .nav-links { display: none; }
    .navbar > .nav-actions { display: none; }
  }

  @media (max-width: 400px) {
    .nav-drawer-actions .btn-ghost,
    .nav-drawer-actions .btn-primary { flex: 1; text-align: center; }
  }
`

export default function Navbar({ onServicesClick }) {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const handleServicesClick = (e) => {
    e.preventDefault()
    setOpen(false)
    onServicesClick?.()
  }

  return (
    <>
      <style>{navCSS}</style>

      <nav className="navbar">
        <div className="nav-logo">Fintara</div>

        {/* desktop links */}
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li>
            <a href="#services" onClick={handleServicesClick} style={{ cursor: 'pointer' }}>
              Our Services
            </a>
          </li>
          <li><a href="#">Contact</a></li>
        </ul>

        {/* desktop actions */}
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/signin">
            <button className="btn-ghost">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="btn-primary">Get Started</button>
          </Link>
        </div>

        {/* hamburger */}
        <button
          className={`nav-hamburger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* mobile drawer */}
      <div className={`nav-drawer${open ? ' open' : ''}`}>
        <ul className="nav-links">
          <li><a href="#" onClick={() => setOpen(false)}>Home</a></li>
          <li>
            <a href="#services" onClick={handleServicesClick} style={{ cursor: 'pointer' }}>
              Our Services
            </a>
          </li>
          <li><a href="#" onClick={() => setOpen(false)}>Contact</a></li>
        </ul>

        <div className="nav-drawer-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/signin" onClick={() => setOpen(false)}>
            <button className="btn-ghost">Sign In</button>
          </Link>
          <Link to="/signup" onClick={() => setOpen(false)}>
            <button className="btn-primary">Get Started</button>
          </Link>
        </div>
      </div>
    </>
  )
}