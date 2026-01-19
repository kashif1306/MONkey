export const getWeekStart = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export const getWeekEnd = (date = new Date()) => {
  const monday = getWeekStart(date)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return sunday
}

export const getDaysUntilWeekEnd = () => {
  const now = new Date()
  const weekEnd = getWeekEnd()
  const diff = weekEnd - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0]
}

export const isToday = (dateString) => {
  return dateString === getTodayString()
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
