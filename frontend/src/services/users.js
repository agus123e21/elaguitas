import api from './api.js'

export async function getUsers(token, { role } = {}) {
  const query = role ? `?role=${role}` : ''
  const data = await api.get(`/users${query}`, { token })
  return data.users
}
