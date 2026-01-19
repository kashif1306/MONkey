import { useState, useEffect, useRef } from 'react'
import { api } from '../utils/api'

function Chatroom({ username }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadMessages()
    // Refresh messages every 2 seconds
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

  return (
    <div className="container">
      <div className="card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '16px' }}>💬 Chatroom</h2>
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
          {messages.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: msg.username === username ? '#dbeafe' : 'white',
                  borderRadius: '8px',
                  borderLeft: msg.username === username ? '3px solid #667eea' : '3px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                      {msg.username}
                    </span>
                    {msg.username === username && (
                      <span className="badge badge-primary" style={{ marginLeft: '8px', fontSize: '10px' }}>
                        You
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.username === username && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '2px 6px'
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ color: '#334155', wordBreak: 'break-word' }}>
                  {msg.message}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chatroom
