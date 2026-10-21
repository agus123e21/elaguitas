import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authService.getStoredToken())
  const [user, setUser] = useState(() => authService.getStoredUser())
  const [loading, setLoading] = useState(false)

  // Validar y sincronizar sesión activa al iniciar la app
  useEffect(() => {
    const currentToken = authService.getStoredToken()
    if (currentToken) {
      authService
        .fetchMe(currentToken)
        .then((data) => {
          if (data?.user) {
            setUser(data.user)
            authService.storeSession({ token: currentToken, user: data.user })
          }
        })
        .catch(() => {
          // Token inválido o expirado -> limpiar sesión para evitar errores 401 en bucle
          authService.clearSession()
          setToken(null)
          setUser(null)
        })
    }
  }, [])

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
    try {
      await authService.logout()
    } catch {
      // continuar limpieza local aunque falle la red
    }
    authService.clearSession()
    localStorage.removeItem('agua_cart')
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
