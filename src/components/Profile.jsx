import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getStorageData } from '../utils/storage'
import { getTodayString } from '../utils/dateUtils'

function Profile({ currentUser }) {
  const { username } = useParams()
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ totalPoints: 0, totalCompletions: 0 })

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = () => {
    const allTasks = getStorageData('tasks') || {}
    const userTasks = allTasks[username] || []
    setTasks(userTasks)

    const completions = getStorageData('completions') || {}
    const userCompletions = completions[username] || []

    let totalPoints = 0
    userCompletions.forEach(completion => {
      const task = userTasks.find(t => t.id === completion.taskId)
      if (task) {
        totalPoints += task.points
      }
    })

    setStats({
      totalPoints,
      totalCompletions: userCompletions.length
    })
  }

  const getCurrentStreak = (taskId) => {
    const completions = getStorageData('completions') || {}
    const userCompletions = completions[username] || []
    const taskCompletions = userCompletions
      .filter(c => c.taskId === taskId)
      .map(c => c.date)
      .sort()
      .reverse()

    if (taskCompletions.length === 0) return 0

    let streak = 0
    let checkDate = new Date()

    for (let i = 0; i < taskCompletions.length; i++) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (taskCompletions.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const getTaskCompletions = (taskId) => {
    const completions = getStorageData('completions') || {}
    const userCompletions = completions[username] || []
    return userCompletions.filter(c => c.taskId === taskId).length
  }

  return (
    <div className="container">
      <div className="card">
        <h1>
          {username}
          {username === currentUser && (
            <span className="badge badge-primary" style={{ marginLeft: '12px', fontSize: '14px' }}>
              You
            </span>
          )}
        </h1>
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
              {stats.totalPoints}
            </div>
            <div style={{ color: '#64748b' }}>Total Points (All Time)</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
              {stats.totalCompletions}
            </div>
            <div style={{ color: '#64748b' }}>Total Completions</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
              {tasks.length}
            </div>
            <div style={{ color: '#64748b' }}>Active Tasks</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Tasks & Streaks</h2>
        {tasks.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No tasks yet
          </p>
        ) : (
          <div className="grid grid-3">
            {tasks.map(task => (
              <div key={task.id} className="card" style={{ background: '#f8fafc' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>{task.name}</h3>
                <div style={{ marginBottom: '8px' }}>
                  <span className="badge badge-primary">{task.points} points</span>
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  <div>🔥 Streak: {getCurrentStreak(task.id)} days</div>
                  <div>✅ Completed: {getTaskCompletions(task.id)} times</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
