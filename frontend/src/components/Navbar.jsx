import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const roleBadges = {
    ADMIN: { label: 'Admin / Dev', bg: '#fef3c7', color: '#92400e' },
    DRIVER: { label: 'Repartidor', bg: '#e0f2fe', color: '#0369a1' },
    CLIENT: { label: 'Cliente', bg: '#f3f4f6', color: '#374151' },
  }

  const currentBadge = user?.role ? roleBadges[user.role] : null

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const currentPath = location.pathname

  return (
    <>
      {/* Top Bar Glassmorphism */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link to="/" className="navbar__brand">
            <span style={{ fontSize: '1.4rem' }}>💧</span>
            <span>El Agüitas</span>
          </Link>

          {currentBadge && (
            <span
              style={{
                background: currentBadge.bg,
                color: currentBadge.color,
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              {currentBadge.label}
            </span>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="navbar__desktop-links">
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin" className="navbar__link" style={{ fontWeight: 600 }}>
                🛡️ Consola Admin & DB
              </Link>
              <Link to="/repartos" className="navbar__link" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                🚚 Vista Repartidor
              </Link>
            </>
          )}

          {user?.role === 'DRIVER' && (
            <Link to="/repartos" className="navbar__link" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              🚚 Mis Repartos
            </Link>
          )}

          {(!user || user?.role === 'CLIENT') && (
            <>
              <Link to="/productos" className="navbar__link">Catálogo</Link>
              {user && <Link to="/pedidos" className="navbar__link">Mis Pedidos</Link>}
            </>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                {user.name}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ fontSize: '0.8rem' }}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Ingresar
            </Link>
          )}
        </nav>

        {/* Mobile Quick Action on Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {user ? (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleLogout}
              style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem', minHeight: '34px' }}
            >
              Salir
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem', minHeight: '34px' }}
            >
              Ingresar
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Dock (Native App Experience) */}
      <nav className="mobile-bottom-nav" aria-label="Navegación Móvil">
        <div className="mobile-bottom-nav__inner">
          {user?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin"
                className={`mobile-nav-item ${currentPath.startsWith('/admin') ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">🛡️</span>
                <span>Admin</span>
              </Link>
              <Link
                to="/repartos"
                className={`mobile-nav-item ${currentPath.startsWith('/repartos') || currentPath.startsWith('/driver') ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">🚚</span>
                <span>Repartos</span>
              </Link>
              <Link
                to="/productos"
                className={`mobile-nav-item ${currentPath === '/productos' ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">💧</span>
                <span>Catálogo</span>
              </Link>
              <Link
                to="/pedidos"
                className={`mobile-nav-item ${currentPath === '/pedidos' ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">📦</span>
                <span>Pedidos</span>
              </Link>
            </>
          )}

          {user?.role === 'DRIVER' && (
            <>
              <Link
                to="/repartos"
                className={`mobile-nav-item ${currentPath.startsWith('/repartos') || currentPath.startsWith('/driver') ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">🚚</span>
                <span>Mis Entregas</span>
              </Link>
              <Link
                to="/productos"
                className={`mobile-nav-item ${currentPath === '/productos' ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">💧</span>
                <span>Catálogo</span>
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-nav-item"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span className="mobile-nav-item__icon">🚪</span>
                <span>Salir</span>
              </button>
            </>
          )}

          {(!user || user?.role === 'CLIENT') && (
            <>
              <Link
                to="/productos"
                className={`mobile-nav-item ${currentPath === '/productos' || currentPath === '/' ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">💧</span>
                <span>Catálogo</span>
              </Link>
              {user ? (
                <Link
                  to="/pedidos"
                  className={`mobile-nav-item ${currentPath === '/pedidos' ? 'mobile-nav-item--active' : ''}`}
                >
                  <span className="mobile-nav-item__icon">📦</span>
                  <span>Mis Pedidos</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`mobile-nav-item ${currentPath === '/login' ? 'mobile-nav-item--active' : ''}`}
                >
                  <span className="mobile-nav-item__icon">🔑</span>
                  <span>Ingresar</span>
                </Link>
              )}
              <Link
                to="/carrito"
                className={`mobile-nav-item ${currentPath === '/carrito' ? 'mobile-nav-item--active' : ''}`}
              >
                <span className="mobile-nav-item__icon">🛒</span>
                <span>Carrito</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
