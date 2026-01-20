import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'

function Header({ username, onLogout }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 3000)
    return () => clearInterval(interval)
  }, [username])

  const loadUnreadCount = async () => {
    try {
      const data = await api.getUnreadCount(username)
      setUnreadCount(data.count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  return (
    <div className="header">
      <div className="header-content">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">🐵 MONKey</div>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/tasks" className="nav-link">My Tasks</Link>
          <Link to="/friends" className="nav-link">Friends</Link>
          <Link to="/resources" className="nav-link">Resources</Link>
          <Link to="/chatroom" className="nav-link" style={{ position: 'relative' }}>
            Chatroom
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                background: 'var(--danger)',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 'bold',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to={`/profile/${username}`} className="nav-link">Profile</Link>
          <button onClick={onLogout} className="btn btn-secondary">Logout</button>
        </nav>
      </div>
    </div>
  )
}

export default Header
