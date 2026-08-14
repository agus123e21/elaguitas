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

  const roleLabels = { CLIENT: 'Cliente', DRIVER: 'Repartidor', ADMIN: 'Admin' }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__logo">💧</span>
        Agua
      </Link>

      <nav className="navbar__links">
        <Link to="/productos" className="navbar__link">Productos</Link>
        <Link to="/promociones" className="navbar__link">Promociones</Link>
        {user && user.role === 'CLIENT' && <Link to="/pedidos" className="navbar__link">Mis pedidos</Link>}
        {user && user.role === 'CLIENT' && <Link to="/direcciones" className="navbar__link">Direcciones</Link>}
        {user && user.role === 'CLIENT' && <Link to="/bidones" className="navbar__link">Bidones</Link>}
        {user && user.role === 'CLIENT' && <Link to="/suscripciones" className="navbar__link">Suscripciones</Link>}
        {user && user.role === 'DRIVER' && <Link to="/repartos" className="navbar__link">Mis repartos</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/pedidos" className="navbar__link">Pedidos</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/productos" className="navbar__link">Productos</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/zonas" className="navbar__link">Zonas</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/bidones" className="navbar__link">Bidones</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin/promociones" className="navbar__link">Promociones</Link>}
        {user && user.role === 'ADMIN' && <Link to="/admin" className="navbar__link">Panel</Link>}
        {user && (
          <Link to="/notificaciones" className="navbar__link navbar__badge">
            Notificaciones
            {unread > 0 && <span className="navbar__dot">{unread}</span>}
          </Link>
        )}
        {user && (
          <span className="navbar__user">
            {user.name}
            <span className="navbar__role">{roleLabels[user.role] || user.role}</span>
          </span>
        )}
        {user ? (
          <button className="btn btn-ghost btn-sm" onClick={logout}>Cerrar sesión</button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Ingresar</Link>
        )}
      </nav>
    </header>
  )
}
