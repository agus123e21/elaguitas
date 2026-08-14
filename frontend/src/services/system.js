import api from './api.js'

export async function getSystemStatus(token) {
  return api.get('/system/status', { token })
}

export async function getSystemLogs(token, { limit = 50, level } = {}) {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit)
  if (level) params.append('level', level)
  const query = params.toString() ? `?${params.toString()}` : ''
  const data = await api.get(`/system/logs${query}`, { token })
  return data.logs
}

export async function clearSystemLogs(token) {
  return api.post('/system/logs/clear', null, { token })
}
