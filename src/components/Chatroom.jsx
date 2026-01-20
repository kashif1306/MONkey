import { useState, useEffect, useRef } from 'react'
import { api } from '../utils/api'

function Chatroom({ username }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [userProfiles, setUserProfiles] = useState({})
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      const data = await api.getMessages()
      setMessages(data)
      
      // Load profile pics for all users
      const uniqueUsers = [...new Set(data.map(m => m.username))]
      for (const user of uniqueUsers) {
        if (!userProfiles[user]) {
          try {
            const profile = await api.getUser(user)
            setUserProfiles(prev => ({ ...prev, [user]: profile }))
          } catch (err) {
            console.error('Error loading profile:', err)
          }
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await api.sendMessage(username, newMessage)
      setNewMessage('')
      loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const deleteMessage = async (id) => {
    try {
      await api.deleteMessage(id)
      loadMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getProfilePic = (user) => {
    return userProfiles[user]?.profilePic || '🐵'
  }

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-header">
          <h2>💬 Team Chat</h2>
          <span className="chat-status">🟢 {messages.length} messages</span>
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>No messages yet</p>
              <span>Start the conversation!</span>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.username === username
              const showAvatar = index === 0 || messages[index - 1].username !== msg.username
              
              return (
                <div key={msg._id} className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
                  {!isOwn && showAvatar && (
                    <div className="message-avatar">{getProfilePic(msg.username)}</div>
                  )}
                  {!isOwn && !showAvatar && <div className="message-avatar-spacer"></div>}
                  
                  <div className="message-content">
                    {showAvatar && (
                      <div className="message-header">
                        <span className="message-username">{msg.username}</span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    )}
                    <div className={`message-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
                      <p>{msg.message}</p>
                      {isOwn && (
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="message-delete"
                          title="Delete message"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {isOwn && showAvatar && (
                    <div className="message-avatar">{getProfilePic(msg.username)}</div>
                  )}
                  {isOwn && !showAvatar && <div className="message-avatar-spacer"></div>}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-input-form">
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
              <span>Send</span>
              <span className="send-icon">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chatroom
