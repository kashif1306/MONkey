import { useState, useEffect } from 'react'
import { api } from '../utils/api'

function Tasks({ username }) {
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskPoints, setTaskPoints] = useState(10)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTasks()
    loadCompletions()
    // Refresh every 3 seconds to see updates
    const interval = setInterval(() => {
      loadTasks()
      loadCompletions()
    }, 3000)
    return () => clearInterval(interval)
  }, [username])

  const loadTasks = async () => {
    try {
      const data = await api.getTasks() // Get ALL tasks (shared)
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const loadCompletions = async () => {
    try {
      const data = await api.getCompletions(username)
      setCompletions(data)
    } catch (error) {
      console.error('Error loading completions:', error)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    setError('')

    if (!taskName.trim()) {
      setError('Task name is required')
      return
    }

    if (taskPoints < 1 || taskPoints > 100) {
      setError('Points must be between 1 and 100')
      return
    }

    try {
      await api.createTask({
        name: taskName,
        points: parseInt(taskPoints),
        recurrence: 'daily',
        createdBy: username
      })

      setTaskName('')
      setTaskPoints(10)
      setShowModal(false)
      loadTasks()
    } catch (error) {
      setError('Failed to create task')
    }
  }

  const voteToDelete = async (taskId) => {
    try {
      const result = await api.voteDeleteTask(taskId, username)
      if (result.deleted) {
        alert('Task deleted! (3+ votes reached)')
      } else {
        alert(`Vote recorded! ${result.votes}/3 votes to delete`)
      }
      loadTasks()
    } catch (error) {
      console.error('Error voting to delete:', error)
    }
  }

  const getTaskHistory = (taskId) => {
    return completions.filter((c) => c.taskId === taskId).length
  }

  const getCurrentStreak = (taskId) => {
    const taskCompletions = completions
      .filter((c) => c.taskId === taskId)
      .map((c) => c.date)
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

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Shared Tasks</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Everyone works on these tasks together!
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Create Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No tasks yet. Create your first shared task!
          </p>
        ) : (
          <div className="grid grid-2">
            {tasks.map((task) => (
              <div key={task._id} className="card" style={{ background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>{task.name}</h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      Created by {task.createdBy}
                    </div>
                  </div>
                  <button
                    onClick={() => voteToDelete(task._id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Vote Delete ({task.deleteVotes?.length || 0}/3)
                  </button>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span className="badge badge-primary">{task.points} points</span>
                  <span className="badge badge-primary" style={{ marginLeft: '8px' }}>
                    Daily
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  <div>🔥 Your Streak: {getCurrentStreak(task._id)} days</div>
                  <div>✅ Your Completions: {getTaskHistory(task._id)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={createTask}>
              <div className="form-group">
                <label>Task Name</label>
                <input
                  type="text"
                  placeholder="e.g., Solve 1 DSA problem"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Points</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={taskPoints}
                  onChange={(e) => setTaskPoints(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Recurrence</label>
                <input type="text" value="Daily" disabled />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks
