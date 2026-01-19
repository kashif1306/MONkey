import { useState, useEffect } from 'react'
import { api } from '../utils/api'

function Resources({ username }) {
  const [resources, setResources] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('DSA')
  const [error, setError] = useState('')

  useEffect(() => {
    loadResources()
    // Refresh every 5 seconds
    const interval = setInterval(loadResources, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadResources = async () => {
    try {
      const data = await api.getResources()
      setResources(data)
    } catch (error) {
      console.error('Error loading resources:', error)
    }
  }

  const addResource = async (e) => {
    e.preventDefault()
    setError('')

    if (!title || !url) {
      setError('Title and URL are required')
      return
    }

    try {
      await api.createResource({ title, url, description, category, username })
      setTitle('')
      setUrl('')
      setDescription('')
      setCategory('DSA')
      setShowModal(false)
      loadResources()
    } catch (error) {
      setError('Failed to add resource')
    }
  }

  const deleteResource = async (id) => {
    if (!confirm('Delete this resource?')) return

    try {
      await api.deleteResource(id)
      loadResources()
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  const categories = ['DSA', 'Web Dev', 'Mobile', 'AI/ML', 'DevOps', 'Other']

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>📚 Learning Resources</h2>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Add Resource
          </button>
        </div>

        {categories.map(cat => {
          const catResources = resources.filter(r => r.category === cat)
          if (catResources.length === 0) return null

          return (
            <div key={cat} style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '12px' }}>{cat}</h3>
              <div className="grid grid-2">
                {catResources.map(resource => (
                  <div key={resource._id} className="card" style={{ background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '8px' }}>{resource.title}</h4>
                        {resource.description && (
                          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                            {resource.description}
                          </p>
                        )}
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#667eea', fontSize: '14px', textDecoration: 'none' }}
                        >
                          🔗 Visit Resource
                        </a>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                          Shared by {resource.username}
                        </div>
                      </div>
                      {resource.username === username && (
                        <button
                          onClick={() => deleteResource(resource._id)}
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {resources.length === 0 && (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No resources yet. Be the first to share!
          </p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Resource</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={addResource}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g., LeetCode"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '6px' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Add Resource
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

export default Resources
