import api from './api.js'

export async function getUsers(token, { role, includeInactive } = {}) {
  const params = new URLSearchParams()
  if (role) params.append('role', role)
  if (includeInactive) params.append('includeInactive', 'true')
  const query = params.toString() ? `?${params.toString()}` : ''
  const data = await api.get(`/users${query}`, { token })
  return data.users
}

export async function createUser(payload, token) {
  const data = await api.post('/users', payload, { token })
  return data.user
}

export async function updateUser(id, payload, token) {
  const data = await api.patch(`/users/${id}`, payload, { token })
  return data.user
}
