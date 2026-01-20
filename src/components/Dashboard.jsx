import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { getTodayString, getDaysUntilWeekEnd } from '../utils/dateUtils'

function Dashboard({ username }) {
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [userProfiles, setUserProfiles] = useState({})
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [activities, setActivities] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    loadDashboard()
    requestNotificationPermission()
    updateUserStatus()
    const interval = setInterval(() => {
      loadDashboard()
      updateUserStatus()
    }, 5000)
    return () => clearInterval(interval)
  }, [username])

  const updateUserStatus = async () => {
    try {
      await api.updateStatus(username, 'online')
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' })
    }
  }

  const loadDashboard = async () => {
    try {
      const allTasks = await api.getTasks()
      setTasks(allTasks)

      const userCompletions = await api.getCompletions(username)
      setCompletions(userCompletions)

      const leaderboardData = await api.getLeaderboard(username)
      setLeaderboard(leaderboardData)

      // Load profile pictures
      for (const user of leaderboardData) {
        if (!userProfiles[user.username]) {
          try {
            const profile = await api.getUser(user.username)
            setUserProfiles(prev => ({ ...prev, [user.username]: profile }))
          } catch (err) {
            console.error('Error loading profile:', err)
          }
        }
      }

      const unreadData = await api.getUnreadCount(username)
      if (unreadData.count > unreadCount && unreadCount > 0) {
        showNotification('New Message', `You have ${unreadData.count} unread messages`)
      }
      setUnreadCount(unreadData.count)

      const activityData = await api.getActivity()
      setActivities(activityData.slice(0, 10))

      const onlineData = await api.getOnlineUsers()
      setOnlineUsers(onlineData)

      setDaysRemaining(getDaysUntilWeekEnd())
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  const toggleTask = async (taskId) => {
    try {
      const today = getTodayString()
      const wasCompleted = isTaskCompleted(taskId)
      await api.toggleCompletion(username, taskId, today)
      
      if (!wasCompleted) {
        const task = tasks.find(t => t._id === taskId)
        showNotification('Task Completed!', `You earned ${task.points} points for "${task.name}"`)
      }
      
      loadDashboard()
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const isTaskCompleted = (taskId) => {
    const today = getTodayString()
    return completions.some(c => c.taskId === taskId && c.date === today)
  }

  const getProfilePic = (user) => {
    const pic = userProfiles[user]?.profilePic
    if (pic && pic.startsWith('data:image')) {
      return <img src={pic} alt={user} />
    }
    return pic || '👤'
  }

  const maxPoints = Math.max(...leaderboard.map(u => u.points), 1)

  return (
    <div className="container">
      {/* Quick Stats */}
      <div className="grid grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Your Stats</h3>
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-value">{leaderboard.find(u => u.username === username)?.points || 0}</div>
              <div className="stat-label">Week Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completions.filter(c => c.date === getTodayString()).length}</div>
              <div className="stat-label">Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{daysRemaining}</div>
              <div className="stat-label">Days Left</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Notifications</h3>
          {unreadCount > 0 ? (
            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{unreadCount} New Message{unreadCount !== 1 ? 's' : ''}</div>
              <a href="/chatroom" style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none' }}>
                View in Chatroom →
              </a>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
              <div>All caught up!</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-grid">
        <div>
          {/* Tasks */}
          <div className="card">
            <h2 style={{ marginBottom: '8px' }}>Today's Tasks</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Complete tasks to earn points and climb the leaderboard
            </p>
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
                <p>No tasks yet</p>
                <a href="/tasks" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Create your first task →</a>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-item ${isTaskCompleted(task._id) ? 'task-completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={isTaskCompleted(task._id)}
                    onChange={() => toggleTask(task._id)}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', marginBottom: '2px' }}>{task.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {task.points} points • by {task.createdBy}
                    </div>
                  </div>
                  {isTaskCompleted(task._id) && (
                    <span style={{ color: 'var(--success)', fontSize: '20px' }}>✓</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          {/* Leaderboard */}
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <div className="empty-state">
                <p>No data yet</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div key={user.username} className="leaderboard-item">
                  <div className={`rank rank-${index + 1}`}>#{index + 1}</div>
                  <div className="leaderboard-avatar">
                    {getProfilePic(user.username)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.username}</div>
                    {user.username === username && (
                      <span className="badge badge-primary">You</span>
                    )}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700' }}>
                    {user.points}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Performance Chart */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Performance</h3>
            <div className="chart-container">
              {leaderboard.map((user) => (
                <div key={user.username} className="chart-bar">
                  <div className="chart-label">{user.username}</div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill" 
                      style={{ width: `${(user.points / maxPoints) * 100}%` }}
                    >
                      {user.points > 0 && user.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Online Users */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Online Now ({onlineUsers.length})</h3>
            {onlineUsers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No one online</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {onlineUsers.map(user => (
                  <div key={user.username} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div className="leaderboard-avatar" style={{ width: '32px', height: '32px', margin: 0 }}>
                      {user.profilePic && user.profilePic.startsWith('data:image') ? (
                        <img src={user.profilePic} alt={user.username} />
                      ) : (
                        user.profilePic || '👤'
                      )}
                    </div>
                    <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>{user.username}</div>
                    <div className="online-indicator"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Recent Activity</h3>
            {activities.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No recent activity</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.map((activity, index) => (
                  <div key={index} style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      {activity.username}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {activity.details}
                      {activity.points > 0 && (
                        <span style={{ color: 'var(--success)', marginLeft: '8px' }}>
                          +{activity.points} pts
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
