import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Coin3D from '../components/Coin3D.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function SignUp({ onLogin }) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.firstName || !form.email || !form.password) {
      setError('Please fill all required fields.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    onLogin({ name: `${form.firstName} ${form.lastName}`, email: form.email, role: 'viewer' })
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo">Fintara</div>
          <div className="auth-visual-coin">
            <Coin3D size={160} />
          </div>
          <p className="auth-visual-tagline">
            Join 12 million people who trust Fintara with their financial future.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h1 className="auth-form-title">Create account</h1>
              <p className="auth-form-sub">Start your financial journey today</p>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" name="firstName" placeholder="Raj" value={form.firstName} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" name="lastName" placeholder="Johnson" value={form.lastName} onChange={handle} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email" placeholder="Raj@example.com" value={form.email} onChange={handle} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handle} />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handle} />
            </div>

            {error && (
              <p style={{ color: '#F44336', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{error}</p>
            )}

            <button className="btn-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
