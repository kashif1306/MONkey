import { useState, useEffect, useRef } from 'react'
import { api } from '../utils/api'

function Resources({ username }) {
  const [resources, setResources] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('DSA')
  const [fileType, setFileType] = useState('link')
  const [fileData, setFileData] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadResources()
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFileData(reader.result)
        setUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addResource = async (e) => {
    e.preventDefault()
    setError('')

    if (!title || !url) {
      setError('Title and URL/File are required')
      return
    }

    try {
      await api.createResource({ title, url, description, category, username, fileType })
      setTitle('')
      setUrl('')
      setDescription('')
      setCategory('DSA')
      setFileType('link')
      setFileData(null)
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

  const categories = ['DSA', 'Web Dev', 'Mobile', 'AI/ML', 'DevOps', 'Design', 'Other']

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>📚 Learning Resources</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Share helpful links, files, and learning materials
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Add Resource
          </button>
        </div>

        {categories.map(cat => {
          const catResources = resources.filter(r => r.category === cat)
          if (catResources.length === 0) return null

          return (
            <div key={cat} style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>{cat}</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {catResources.map(resource => (
                  <div key={resource._id} className="resource-item">
                    <div className="resource-header">
                      <div style={{ flex: 1 }}>
                        <div className="resource-title">
                          {resource.fileType === 'file' ? '📎 ' : '🔗 '}
                          {resource.title}
                        </div>
                        {resource.description && (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                            {resource.description}
                          </p>
                        )}
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-url"
                        >
                          {resource.fileType === 'file' ? 'Download File' : 'Visit Link'} →
                        </a>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                          Shared by {resource.username}
                        </div>
                      </div>
                      {resource.username === username && (
                        <button
                          onClick={() => deleteResource(resource._id)}
                          className="btn btn-danger btn-sm"
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
          <div className="empty-state">
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
            <p>No resources yet</p>
            <span>Be the first to share!</span>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Resource</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={addResource}>
              <div className="form-group">
                <label>Type</label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      value="link"
                      checked={fileType === 'link'}
                      onChange={(e) => setFileType(e.target.value)}
                    />
                    Link
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      value="file"
                      checked={fileType === 'file'}
                      onChange={(e) => setFileType(e.target.value)}
                    />
                    File
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g., LeetCode Solutions"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {fileType === 'link' ? (
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
                  />
                  {fileData && (
                    <div style={{ fontSize: '13px', color: 'var(--success)', marginTop: '8px' }}>
                      ✓ File selected
                    </div>
                  )}
                </div>
              )}

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
