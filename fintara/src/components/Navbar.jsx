import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar({ onServicesClick }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar">
      <div className="nav-logo">
         <span>Fintara</span>
      </div>
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li>
          <a
            href="#services"
            onClick={(e) => { e.preventDefault(); onServicesClick?.() }}
            style={{ cursor: 'pointer' }}
          >
            Our Services
          </a>
        </li>
        
        <li><a href="#">Contact</a></li>
      </ul>
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
    </nav>
  )
}
