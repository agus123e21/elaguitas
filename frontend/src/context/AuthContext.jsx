import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as authService from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authService.getStoredToken())
  const [user, setUser] = useState(() => authService.getStoredUser())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      setToken(data.token)
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const data = await authService.register(payload)
      setToken(data.token)
      setUser(data.user)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setToken(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) return
    try {
      const data = await authService.fetchMe(token)
      setUser(data.user)
      return data.user
    } catch {
      return null
    }
  }, [token])

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, refreshUser }),
    [token, user, loading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
