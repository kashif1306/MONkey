import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { getTodayString, getDaysUntilWeekEnd } from '../utils/dateUtils'
import confetti from 'canvas-confetti'

function Dashboard({ username }) {
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadDashboard()
    const interval = setInterval(loadDashboard, 3000)
    return () => clearInterval(interval)
  }, [username])

  const loadDashboard = async () => {
    try {
      const allTasks = await api.getTasks()
      setTasks(allTasks)

      const userCompletions = await api.getCompletions(username)
      setCompletions(userCompletions)

      const leaderboardData = await api.getLeaderboard(username)
      setLeaderboard(leaderboardData)

      const unreadData = await api.getUnreadCount(username)
      setUnreadCount(unreadData.count)

      setDaysRemaining(getDaysUntilWeekEnd())
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  const toggleTask = async (taskId) => {
    try {
      const today = getTodayString()
      await api.toggleCompletion(username, taskId, today)
      loadDashboard()
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const isTaskCompleted = (taskId) => {
    const today = getTodayString()
    return completions.some(c => c.taskId === taskId && c.date === today)
  }

  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="card">
          <h2>🏆 Weekly Leaderboard</h2>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} until winner is declared
          </p>
          {leaderboard.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No data yet. Complete tasks to earn points!</p>
          ) : (
            leaderboard.map((user, index) => (
              <div key={user.username} className="leaderboard-item">
                <div className={`rank rank-${index + 1}`}>#{index + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{user.username}</div>
                  {user.username === username && (
                    <span className="badge badge-primary">You</span>
                  )}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                  {user.points} pts
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>✅ Today's Shared Tasks</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
            Complete these tasks to earn points!
          </p>
          {tasks.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>
              No tasks yet. Go to <a href="/tasks" style={{ color: '#667eea' }}>My Tasks</a> to create some!
            </p>
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
                  <div style={{ fontWeight: '500' }}>{task.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {task.points} points • by {task.createdBy}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>📊 Quick Stats</h2>
          {unreadCount > 0 && (
            <a href="/chatroom" style={{ textDecoration: 'none' }}>
              <div className="badge badge-unread">
                {unreadCount} new message{unreadCount !== 1 ? 's' : ''}
              </div>
            </a>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--neon-yellow)' }}>
              {leaderboard.find(u => u.username === username)?.points || 0}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your Week Points</div>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--neon-blue)' }}>
              {completions.filter(c => c.date === getTodayString()).length}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Completed Today</div>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success)' }}>
              {daysRemaining}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Days Until Winner</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
