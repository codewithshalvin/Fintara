import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Coin3D from '../components/Coin3D.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function SignIn({ onLogin }) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill all fields.')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    onLogin({ name: 'Raj', email: form.email, role: 'viewer' })
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      {/* Left visual */}
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo"> Fintara</div>
          <div className="auth-visual-coin">
            <Coin3D size={160} />
          </div>
          <p className="auth-visual-tagline">
            Smart control over millions of transactions. Welcome back.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h1 className="auth-form-title">Welcome back</h1>
              <p className="auth-form-sub">Sign in to your Fintara account</p>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Raj@example.com"
                value={form.email}
                onChange={handle}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
              />
            </div>

            {error && (
              <p style={{ color: '#F44336', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{error}</p>
            )}

            <button className="btn-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="divider-or">or</div>

          <button
            className="btn-full"
            style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)', border: '1px solid var(--border)', marginTop: 0 }}
            onClick={() => {
              onLogin({ name: 'Demo User', email: 'demo@fintara.com', role: 'viewer' })
              navigate('/dashboard')
            }}
          >
            Continue as Viewer Demo
          </button>

          <button
            className="btn-full"
            style={{ background: 'var(--bg-glass)', color: 'var(--accent)', border: '1px solid var(--border)', marginTop: '0.6rem' }}
            onClick={() => {
              onLogin({ name: 'Admin User', email: 'admin@fintara.com', role: 'admin' })
              navigate('/dashboard')
            }}
          >
             Continue as Admin Demo
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
