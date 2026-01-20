import { useState, useEffect, useRef } from 'react'
import { api } from '../utils/api'

function Tasks({ username }) {
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskPoints, setTaskPoints] = useState(10)
  const [error, setError] = useState('')
  
  // Focus Timer
  const [focusTask, setFocusTask] = useState(null)
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerMode, setTimerMode] = useState('focus') // focus, break
  const [soundEnabled, setSoundEnabled] = useState(true)
  const timerInterval = useRef(null)
  
  // Doing Now
  const [doingNow, setDoingNow] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    loadTasks()
    loadCompletions()
    loadOnlineUsers()
    const interval = setInterval(() => {
      loadTasks()
      loadCompletions()
      loadOnlineUsers()
    }, 3000)
    return () => clearInterval(interval)
  }, [username])

  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            handleTimerComplete()
          } else {
            setTimerMinutes(timerMinutes - 1)
            setTimerSeconds(59)
          }
        } else {
          setTimerSeconds(timerSeconds - 1)
        }
      }, 1000)
    } else {
      clearInterval(timerInterval.current)
    }
    return () => clearInterval(timerInterval.current)
  }, [isTimerRunning, timerMinutes, timerSeconds])

  const loadTasks = async () => {
    try {
      const data = await api.getTasks()
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

  const loadOnlineUsers = async () => {
    try {
      const data = await api.getOnlineUsers()
      setOnlineUsers(data)
    } catch (error) {
      console.error('Error loading online users:', error)
    }
  }

  const playSound = (type) => {
    if (!soundEnabled) return
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    if (type === 'complete') {
      oscillator.frequency.value = 800
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } else if (type === 'tick') {
      oscillator.frequency.value = 400
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  const handleTimerComplete = () => {
    setIsTimerRunning(false)
    playSound('complete')
    
    if (timerMode === 'focus') {
      new Notification('Focus Session Complete!', {
        body: `Great job! Time for a ${timerMode === 'focus' ? '5' : '25'} minute break.`,
        icon: '/favicon.ico'
      })
      setTimerMode('break')
      setTimerMinutes(5)
    } else {
      new Notification('Break Complete!', {
        body: 'Ready for another focus session?',
        icon: '/favicon.ico'
      })
      setTimerMode('focus')
      setTimerMinutes(25)
    }
    setTimerSeconds(0)
  }

  const startFocusSession = (task) => {
    setFocusTask(task)
    setDoingNow(task)
    setTimerMinutes(25)
    setTimerSeconds(0)
    setTimerMode('focus')
    setIsTimerRunning(true)
    playSound('tick')
  }

  const stopFocusSession = () => {
    setIsTimerRunning(false)
    setFocusTask(null)
    setDoingNow(null)
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
      playSound('complete')
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

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="container">
      {/* Focus Timer */}
      {focusTask && (
        <div className="card" style={{ background: timerMode === 'focus' ? 'var(--bg-secondary)' : 'var(--bg-tertiary)', border: '2px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ marginBottom: '4px' }}>
                {timerMode === 'focus' ? '🎯 Focus Session' : '☕ Break Time'}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                {focusTask.name}
              </p>
            </div>
            <button onClick={stopFocusSession} className="btn btn-secondary btn-sm">
              Stop Session
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '72px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>
              {formatTime(timerMinutes, timerSeconds)}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)} 
                className="btn btn-primary"
              >
                {isTimerRunning ? '⏸ Pause' : '▶ Start'}
              </button>
              <button 
                onClick={() => {
                  setTimerMinutes(timerMode === 'focus' ? 25 : 5)
                  setTimerSeconds(0)
                  setIsTimerRunning(false)
                }} 
                className="btn btn-secondary"
              >
                🔄 Reset
              </button>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                className="btn btn-secondary"
                title={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button 
              onClick={() => { setTimerMinutes(25); setTimerSeconds(0); setTimerMode('focus'); setIsTimerRunning(false); }} 
              className={`btn btn-sm ${timerMode === 'focus' ? 'btn-primary' : 'btn-secondary'}`}
            >
              25 min
            </button>
            <button 
              onClick={() => { setTimerMinutes(15); setTimerSeconds(0); setTimerMode('focus'); setIsTimerRunning(false); }} 
              className="btn btn-secondary btn-sm"
            >
              15 min
            </button>
            <button 
              onClick={() => { setTimerMinutes(5); setTimerSeconds(0); setTimerMode('break'); setIsTimerRunning(false); }} 
              className={`btn btn-sm ${timerMode === 'break' ? 'btn-primary' : 'btn-secondary'}`}
            >
              5 min
            </button>
          </div>
        </div>
      )}

      {/* Doing Now Section */}
      {doingNow && (
        <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
          <h3 style={{ marginBottom: '16px' }}>👥 Who's Working Now</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div className="leaderboard-avatar" style={{ width: '48px', height: '48px' }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{username}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Working on: {doingNow.name}
              </div>
            </div>
            <div className="online-indicator"></div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Shared Tasks</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Everyone works on these tasks together!
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Create Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>No tasks yet</p>
            <span>Create your first shared task!</span>
          </div>
        ) : (
          <div className="grid grid-2">
            {tasks.map((task) => (
              <div key={task._id} className="card" style={{ background: 'var(--bg-tertiary)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, marginBottom: '8px' }}>{task.name}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span className="badge badge-primary">{task.points} points</span>
                      <span className="badge badge-success">Daily</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <div>🔥 Your Streak: {getCurrentStreak(task._id)} days</div>
                      <div>✅ Completions: {getTaskHistory(task._id)}</div>
                      <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        by {task.createdBy}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => startFocusSession(task)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    disabled={focusTask !== null}
                  >
                    🎯 Start Focus
                  </button>
                  <button
                    onClick={() => voteToDelete(task._id)}
                    className="btn btn-danger btn-sm"
                  >
                    🗑️ ({task.deleteVotes?.length || 0}/3)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
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
                <label>Points (1-100)</label>
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
                <input type="text" value="Daily" disabled style={{ opacity: 0.6 }} />
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
