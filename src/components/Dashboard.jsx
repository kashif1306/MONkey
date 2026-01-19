import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { getTodayString, getDaysUntilWeekEnd } from '../utils/dateUtils'
import confetti from 'canvas-confetti'

function Dashboard({ username }) {
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [daysRemaining, setDaysRemaining] = useState(0)

  useEffect(() => {
    loadDashboard()
    // Refresh dashboard every 3 seconds to see updates
    const interval = setInterval(loadDashboard, 3000)
    return () => clearInterval(interval)
  }, [username])

  const loadDashboard = async () => {
    try {
      const allTasks = await api.getTasks() // Get ALL shared tasks
      setTasks(allTasks)

      const userCompletions = await api.getCompletions(username)
      setCompletions(userCompletions)

      const leaderboardData = await api.getLeaderboard(username)
      setLeaderboard(leaderboardData)

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
        <h2>📊 Friend Activity</h2>
        <p style={{ color: '#94a3b8' }}>Coming soon - see what friends completed today!</p>
      </div>
    </div>
  )
}

export default Dashboard
