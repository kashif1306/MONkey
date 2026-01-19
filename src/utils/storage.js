export const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export const setStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Storage error:', error)
  }
}

export const initializeStorage = () => {
  if (!getStorageData('users')) {
    setStorageData('users', {})
  }
  if (!getStorageData('tasks')) {
    setStorageData('tasks', {})
  }
  if (!getStorageData('completions')) {
    setStorageData('completions', {})
  }
  if (!getStorageData('friends')) {
    setStorageData('friends', {})
  }
}
