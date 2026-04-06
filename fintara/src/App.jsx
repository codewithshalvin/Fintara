import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  const ProtectedRoute = ({ activePage }) => {
    if (!isAuthenticated) return <Navigate to="/signin" />
    return <Dashboard user={user} onLogout={handleLogout} activePage={activePage} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn onLogin={handleLogin} />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp onLogin={handleLogin} />
        } />
        <Route path="/dashboard"    element={<ProtectedRoute activePage="overview" />} />
        <Route path="/transactions" element={<ProtectedRoute activePage="transactions" />} />
        <Route path="/insights"     element={<ProtectedRoute activePage="insights" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}