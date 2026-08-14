import api from './api.js'

const TOKEN_KEY = 'agua_token'
const USER_KEY = 'agua_user'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function storeSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
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
