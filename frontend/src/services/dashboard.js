import api from './api.js'

export async function getDashboard(token) {
  return api.get('/dashboard', { token })
}
