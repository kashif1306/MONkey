const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = {
  // Auth
  signup: async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    return res.json()
  },

  login: async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    return res.json()
  },

  // User profile
  getUser: async (username) => {
    const res = await fetch(`${API_URL}/api/users/${username}`)
    return res.json()
  },

  updateProfilePic: async (username, profilePic) => {
    const res = await fetch(`${API_URL}/api/users/${username}/profile-pic`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profilePic })
    })
    return res.json()
  },

  // Tasks - SHARED FOR EVERYONE
  getTasks: async () => {
    const res = await fetch(`${API_URL}/api/tasks`)
    return res.json()
  },

  createTask: async (taskData) => {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    })
    return res.json()
  },

  voteDeleteTask: async (taskId, username) => {
    const res = await fetch(`${API_URL}/api/tasks/${taskId}/vote-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
    return res.json()
  },

  deleteTask: async (id) => {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' })
    return res.json()
  },

  // Completions
  getCompletions: async (username) => {
    const res = await fetch(`${API_URL}/api/completions/${username}`)
    return res.json()
  },

  toggleCompletion: async (username, taskId, date) => {
    const res = await fetch(`${API_URL}/api/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, taskId, date })
    })
    return res.json()
  },

  // Friends
  getFriends: async (username) => {
    const res = await fetch(`${API_URL}/api/friends/${username}`)
    return res.json()
  },

  addFriend: async (username, friendUsername) => {
    const res = await fetch(`${API_URL}/api/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, friendUsername })
    })
    return res.json()
  },

  removeFriend: async (username, friendUsername) => {
    const res = await fetch(`${API_URL}/api/friends/${username}/${friendUsername}`, {
      method: 'DELETE'
    })
    return res.json()
  },

  // Leaderboard
  getLeaderboard: async (username) => {
    const res = await fetch(`${API_URL}/api/leaderboard/${username}`)
    return res.json()
  },

  // Resources
  getResources: async () => {
    const res = await fetch(`${API_URL}/api/resources`)
    return res.json()
  },

  createResource: async (resourceData) => {
    const res = await fetch(`${API_URL}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resourceData)
    })
    return res.json()
  },

  deleteResource: async (id) => {
    const res = await fetch(`${API_URL}/api/resources/${id}`, { method: 'DELETE' })
    return res.json()
  },

  // Messages
  getMessages: async () => {
    const res = await fetch(`${API_URL}/api/messages`)
    return res.json()
  },

  sendMessage: async (username, message, imageUrl = '') => {
    const res = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message, imageUrl })
    })
    return res.json()
  },

  markMessageRead: async (messageId, username) => {
    const res = await fetch(`${API_URL}/api/messages/${messageId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
    return res.json()
  },

  getUnreadCount: async (username) => {
    const res = await fetch(`${API_URL}/api/messages/unread/${username}`)
    return res.json()
  },

  deleteMessage: async (id) => {
    const res = await fetch(`${API_URL}/api/messages/${id}`, { method: 'DELETE' })
    return res.json()
  }
}
