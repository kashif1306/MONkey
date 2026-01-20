import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api'

function Profile({ currentUser }) {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState('')
  const [stats, setStats] = useState({ totalPoints: 0, completedToday: 0, weekPoints: 0 })

  const emojiOptions = ['🐵', '🦍', '🐒', '🦧', '🙈', '🙉', '🙊', '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐔', '🐧', '🦄', '🦋', '🐝', '🐛', '🦖', '🦕', '🐙', '🦑', '🦀', '🐠', '🐡', '🦈', '🐬', '🐳', '🦭', '🦦', '🦥', '🦘', '🦫']

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    try {
      const userData = await api.getUser(username)
      setProfile(userData)
      setSelectedEmoji(userData.profilePic || '🐵')
      
      // Get user's completions for stats
      const completions = await api.getCompletions(username)
      const tasks = await api.getTasks()
      
      let totalPoints = 0
      let completedToday = 0
      let weekPoints = 0
      
      const today = new Date().toISOString().split('T')[0]
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
      
      completions.forEach(comp => {
        const task = tasks.find(t => t._id === comp.taskId)
        if (task) {
          totalPoints += task.points
          if (comp.date === today) {
            completedToday++
          }
          if (new Date(comp.completedAt) >= weekStart) {
            weekPoints += task.points
          }
        }
      })
      
      setStats({ totalPoints, completedToday, weekPoints })
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const saveProfilePic = async () => {
    try {
      await api.updateProfilePic(username, selectedEmoji)
      setIsEditing(false)
      loadProfile()
    } catch (error) {
      console.error('Error updating profile pic:', error)
    }
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="profile-header-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {profile.profilePic || '🐵'}
          </div>
          {username === currentUser && (
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="btn btn-secondary btn-sm"
            >
              {isEditing ? 'Cancel' : 'Change Avatar'}
            </button>
          )}
        </div>
        
        <div className="profile-info-section">
          <h1 className="profile-username">
            {username}
            {username === currentUser && (
              <span className="badge badge-primary">You</span>
            )}
          </h1>
          
          <div className="profile-stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{stats.weekPoints}</div>
              <div className="stat-label">Week Points</div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{stats.completedToday}</div>
              <div className="stat-label">Today</div>
            </div>
            <div className="stat-card stat-info">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{stats.totalPoints}</div>
              <div className="stat-label">All Time</div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="card">
          <h3>Choose Your Avatar</h3>
          <div className="emoji-grid">
            {emojiOptions.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`emoji-option ${selectedEmoji === emoji ? 'emoji-selected' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button onClick={saveProfilePic} className="btn btn-primary">
              Save Avatar
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
