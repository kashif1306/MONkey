import { Link } from 'react-router-dom'

function Header({ username, onLogout }) {
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
          <Link to="/chatroom" className="nav-link">Chatroom</Link>
          <Link to={`/profile/${username}`} className="nav-link">Profile</Link>
          <button onClick={onLogout} className="btn btn-secondary">Logout</button>
        </nav>
      </div>
    </div>
  )
}

export default Header
