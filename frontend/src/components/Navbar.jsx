import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getNotifications } from '../services/notifications.js'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!user) {
      setUnread(0)
      return
    }
    const token = localStorage.getItem('agua_token')
    if (!token) return
    let cancelled = false
    const poll = () =>
      getNotifications(token)
        .then((data) => {
          if (!cancelled) setUnread(data.unread)
        })
        .catch(() => {})
    poll()
    const interval = setInterval(poll, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [user])

  return (
    <header className="navbar">
      <Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>
        Agua
      </Link>

      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/productos">Productos</Link>
        <Link to="/promociones">Promociones</Link>
        {user && user.role === 'CLIENT' && <Link to="/pedidos">Mis pedidos</Link>}
        {user && user.role === 'CLIENT' && <Link to="/direcciones">Direcciones</Link>}
        {user && user.role === 'CLIENT' && <Link to="/bidones">Bidones</Link>}
        {user && user.role === 'CLIENT' && <Link to="/suscripciones">Suscripciones</Link>}
        {user && user.role === 'DRIVER' && <Link to="/repartos">Mis repartos</Link>}
        {user && (
          <Link to="/notificaciones" style={{ position: 'relative', textDecoration: 'none', color: 'inherit' }}>
            Notificaciones
            {unread > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -10,
                  background: '#e74c3c',
                  color: '#fff',
                  borderRadius: 10,
                  fontSize: '0.7rem',
                  padding: '0 6px',
                  lineHeight: '18px',
                }}
              >
                {unread}
              </span>
            )}
          </Link>
        )}
        {user && user.role === 'ADMIN' && <Link to="/admin/pedidos">Pedidos</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/productos">Productos</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/zonas">Zonas</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/bidones">Bidones</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/promociones">Promociones</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin">Panel</Link>}
        {user && (
          <span style={{ opacity: 0.7 }}>
            {user.name} ({user.role})
          </span>
        )}
        {user ? (
          <button onClick={logout}>Cerrar sesión</button>
        ) : (
          <Link to="/login">Ingresar</Link>
        )}
      </nav>
    </header>
  )
}
