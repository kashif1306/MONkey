import { useState } from 'react'

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!username || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login'
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(username)
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (error) {
      setError('Failed to connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="logo" style={{ textAlign: 'center', marginBottom: '32px' }}>
          🐵 MONKey
        </h1>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '12px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#64748b' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsSignup(!isSignup)
              setError('')
            }}
            style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </a>
        </p>
      </div>
    </div>
  )
}

export default Auth
