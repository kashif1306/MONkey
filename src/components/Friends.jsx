import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

function Friends({ username }) {
  const [friends, setFriends] = useState([])
  const [searchUsername, setSearchUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadFriends()
    // Refresh friends list every 3 seconds
    const interval = setInterval(loadFriends, 3000)
    return () => clearInterval(interval)
  }, [username])

  const loadFriends = async () => {
    try {
      const data = await api.getFriends(username)
      setFriends(data)
    } catch (error) {
      console.error('Error loading friends:', error)
    }
  }

  const addFriend = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!searchUsername.trim()) {
      setError('Please enter a username')
      return
    }

    if (searchUsername === username) {
      setError("You can't add yourself as a friend")
      return
    }

    try {
      const result = await api.addFriend(username, searchUsername)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(`Added ${searchUsername} as a friend!`)
        setSearchUsername('')
        loadFriends()
      }
    } catch (error) {
      setError('Failed to add friend')
    }
  }

  const removeFriend = async (friendUsername) => {
    if (!confirm(`Remove ${friendUsername} from friends?`)) return

    try {
      await api.removeFriend(username, friendUsername)
      loadFriends()
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Add Friend</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={addFriend} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Enter username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <button type="submit" className="btn btn-primary">
            Add Friend
          </button>
        </form>
      </div>

      <div className="card">
        <h2>My Friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No friends yet. Add friends to compete with them!
          </p>
        ) : (
          friends.map(friend => (
            <div key={friend} className="friend-item">
              <div style={{ flex: 1 }}>
                <Link
                  to={`/profile/${friend}`}
                  style={{ textDecoration: 'none', color: '#667eea', fontWeight: '600' }}
                >
                  {friend}
                </Link>
              </div>
              <button
                onClick={() => removeFriend(friend)}
                className="btn btn-danger"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Friends
