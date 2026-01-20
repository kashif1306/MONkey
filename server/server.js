import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// CORS Configuration - Allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(cors())
app.use(express.json())

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/monkey-tracker'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' }, // URL or emoji
  createdAt: { type: Date, default: Date.now }
})

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, required: true },
  recurrence: { type: String, default: 'daily' },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deleteVotes: [{ type: String }] // Array of usernames who voted to delete
})

const completionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  taskId: { type: String, required: true },
  date: { type: String, required: true },
  completedAt: { type: Date, default: Date.now }
})

const friendSchema = new mongoose.Schema({
  username: { type: String, required: true },
  friendUsername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const resourceSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  category: { type: String, default: 'Other' },
  createdAt: { type: Date, default: Date.now }
})

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  imageUrl: { type: String, default: '' }, // For image messages
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: String }] // Array of usernames who read the message
})

const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', taskSchema)
const Completion = mongoose.model('Completion', completionSchema)
const Friend = mongoose.model('Friend', friendSchema)
const Resource = mongoose.model('Resource', resourceSchema)
const Message = mongoose.model('Message', messageSchema)

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body
    const existing = await User.findOne({ username })
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' })
    }
    const user = new User({ username, password })
    await user.save()
    res.json({ success: true, username })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username, password })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    res.json({ success: true, username, profilePic: user.profilePic })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update profile picture
app.put('/api/users/:username/profile-pic', async (req, res) => {
  try {
    const { profilePic } = req.body
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { profilePic },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ success: true, profilePic: user.profilePic })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user profile
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ username: user.username, profilePic: user.profilePic, createdAt: user.createdAt })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Task Routes - SHARED TASKS FOR EVERYONE
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/tasks/:id/vote-delete', async (req, res) => {
  try {
    const { username } = req.body
    const task = await Task.findById(req.params.id)
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    // Add vote if not already voted
    if (!task.deleteVotes.includes(username)) {
      task.deleteVotes.push(username)
      await task.save()
    }

    // If 3 or more votes, delete the task
    if (task.deleteVotes.length >= 3) {
      await Task.findByIdAndDelete(req.params.id)
      await Completion.deleteMany({ taskId: req.params.id })
      return res.json({ success: true, deleted: true, message: 'Task deleted with 3+ votes' })
    }

    res.json({ success: true, deleted: false, votes: task.deleteVotes.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    await Completion.deleteMany({ taskId: req.params.id })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Completion Routes
app.get('/api/completions/:username', async (req, res) => {
  try {
    const completions = await Completion.find({ username: req.params.username })
    res.json(completions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/completions', async (req, res) => {
  try {
    const { username, taskId, date } = req.body
    const existing = await Completion.findOne({ username, taskId, date })
    
    if (existing) {
      await Completion.findByIdAndDelete(existing._id)
      res.json({ success: true, action: 'removed' })
    } else {
      const completion = new Completion(req.body)
      await completion.save()
      res.json({ success: true, action: 'added', completion })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Friend Routes
app.get('/api/friends/:username', async (req, res) => {
  try {
    const friends = await Friend.find({ username: req.params.username })
    res.json(friends.map(f => f.friendUsername))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/friends', async (req, res) => {
  try {
    const { username, friendUsername } = req.body
    const user = await User.findOne({ username: friendUsername })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const existing = await Friend.findOne({ username, friendUsername })
    if (existing) {
      return res.status(400).json({ error: 'Already friends' })
    }
    const friend = new Friend({ username, friendUsername })
    await friend.save()
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/friends/:username/:friendUsername', async (req, res) => {
  try {
    await Friend.findOneAndDelete({
      username: req.params.username,
      friendUsername: req.params.friendUsername
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Resource Routes
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 })
    res.json(resources)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/resources', async (req, res) => {
  try {
    const resource = new Resource(req.body)
    await resource.save()
    res.json(resource)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/resources/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Message Routes
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100)
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message(req.body)
    await message.save()
    res.json(message)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark message as read
app.post('/api/messages/:id/read', async (req, res) => {
  try {
    const { username } = req.body
    const message = await Message.findById(req.params.id)
    if (message && !message.readBy.includes(username)) {
      message.readBy.push(username)
      await message.save()
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get unread count
app.get('/api/messages/unread/:username', async (req, res) => {
  try {
    const count = await Message.countDocuments({
      username: { $ne: req.params.username },
      readBy: { $ne: req.params.username }
    })
    res.json({ count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Leaderboard Route
app.get('/api/leaderboard/:username', async (req, res) => {
  try {
    const username = req.params.username
    const friends = await Friend.find({ username })
    const usernames = [username, ...friends.map(f => f.friendUsername)]
    
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
    weekStart.setHours(0, 0, 0, 0)
    
    const leaderboard = await Promise.all(
      usernames.map(async (user) => {
        const completions = await Completion.find({
          username: user,
          completedAt: { $gte: weekStart }
        })
        
        let totalPoints = 0
        for (const completion of completions) {
          const task = await Task.findById(completion.taskId)
          if (task) totalPoints += task.points
        }
        
        return { username: user, points: totalPoints }
      })
    )
    
    leaderboard.sort((a, b) => b.points - a.points)
    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Test routes - MUST be before app.listen
app.get('/api/test', (req, res) => {
  console.log('✅ /api/test route hit')
  res.json({ message: 'Backend is working!', timestamp: new Date() })
})

app.get('/', (req, res) => {
  console.log('✅ / route hit')
  res.json({ message: 'MONKey Backend API', status: 'running', version: '1.0.1' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Network: http://10.162.219.211:${PORT}`)
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`)
})
