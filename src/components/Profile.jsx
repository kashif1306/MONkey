import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api'

function Profile({ currentUser }) {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ totalPoints: 0, completedToday: 0, weekPoints: 0 })
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    try {
      const userData = await api.getUser(username)
      setProfile(userData)
      
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          await api.updateProfilePic(username, reader.result)
          loadProfile()
        } catch (error) {
          console.error('Error updating profile pic:', error)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  const displayPic = () => {
    if (profile.profilePic && profile.profilePic.startsWith('data:image')) {
      return <img src={profile.profilePic} alt={username} />
    }
    return profile.profilePic || '🐵'
  }

  return (
    <div className="container">
      <div className="profile-header-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {displayPic()}
          </div>
          {username === currentUser && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn btn-secondary btn-sm"
              >
                📷 Change Photo
              </button>
            </>
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

      {username === currentUser && (
        <div className="card">
          <h3>💡 Pro Tip</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Upload a custom profile picture to personalize your account! Your photo will appear in the chat and on the leaderboard.
          </p>
        </div>
      )}
    </div>
  )
}

export default Profile
