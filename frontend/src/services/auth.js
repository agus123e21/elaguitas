import api from './api.js'

const TOKEN_KEY = 'agua_token'
const USER_KEY = 'agua_user'

export function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token')
  return token && token !== 'undefined' && token !== 'null' ? token : null
}

export function getStoredUser() {
  try {
    const userStr = localStorage.getItem(USER_KEY) || localStorage.getItem('user')
    if (!userStr || userStr === 'undefined' || userStr === 'null') return null
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function storeSession({ token, user }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem('token', token)
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('agua_cart')
}

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password })
  storeSession(data)
  return data
}

export async function register(payload) {
  const data = await api.post('/auth/register', payload)
  storeSession(data)
  return data
}

export async function logout() {
  const token = getStoredToken()
  try {
    if (token) await api.post('/auth/logout', null, { token })
  } finally {
    clearSession()
  }
}

export async function fetchMe(token) {
  return api.get('/auth/me', { token })
}

export async function forgotPassword(email) {
  return api.post('/auth/forgot-password', { email })
}

export async function resetPassword(token, password) {
  return api.post('/auth/reset-password', { token, password })
}
