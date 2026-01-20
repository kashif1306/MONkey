import { useState, useEffect, useRef } from 'react'
import { api } from '../utils/api'

function Chatroom({ username }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [userProfiles, setUserProfiles] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
    markMessagesAsRead()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const markMessagesAsRead = async () => {
    try {
      for (const msg of messages) {
        if (msg.username !== username && !msg.readBy?.includes(username)) {
          await api.markMessageRead(msg._id, username)
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const data = await api.getMessages()
      setMessages(data)
      
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() && !imagePreview) return

    try {
      await api.sendMessage(username, newMessage || '📷 Image', imagePreview || '')
      setNewMessage('')
      removeImage()
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
    const pic = userProfiles[user]?.profilePic
    if (pic && pic.startsWith('data:image')) {
      return <img src={pic} alt={user} />
    }
    return pic || '🐵'
  }

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-header">
          <h2>
            💬 Team Chat
          </h2>
          <span className="chat-status">
            🟢 {messages.length} messages
          </span>
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
                      {msg.message && <p>{msg.message}</p>}
                      {msg.imageUrl && (
                        <img 
                          src={msg.imageUrl} 
                          alt="Shared" 
                          className="message-image"
                          onClick={() => window.open(msg.imageUrl, '_blank')}
                        />
                      )}
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
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" onClick={removeImage} className="image-preview-remove">
                ×
              </button>
            </div>
          )}
          <div className="chat-input-wrapper">
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="chat-input"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="image-upload-btn"
                title="Upload image"
              >
                📎
              </button>
            </div>
            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim() && !imagePreview}>
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
