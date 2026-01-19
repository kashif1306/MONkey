import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Friends from './components/Friends'
import Resources from './components/Resources'
import Chatroom from './components/Chatroom'
import Profile from './components/Profile'
import Header from './components/Header'
import { getStorageData, setStorageData } from './utils/storage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = getStorageData('currentUser')
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const handleLogin = (username) => {
    setCurrentUser(username)
    setStorageData('currentUser', username)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setStorageData('currentUser', null)
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <Router>
      <Header username={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard username={currentUser} />} />
        <Route path="/tasks" element={<Tasks username={currentUser} />} />
        <Route path="/friends" element={<Friends username={currentUser} />} />
        <Route path="/resources" element={<Resources username={currentUser} />} />
        <Route path="/chatroom" element={<Chatroom username={currentUser} />} />
        <Route path="/profile/:username" element={<Profile currentUser={currentUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
