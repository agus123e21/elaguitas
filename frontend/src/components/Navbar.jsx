import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
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

  return (
    <header className="navbar" style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link to="/" className="navbar__brand" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
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
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {currentBadge.label}
          </span>
        )}
      </div>

      <nav className="navbar__links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Enlaces de Admin */}
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

        {/* Enlaces de Repartidor */}
        {user?.role === 'DRIVER' && (
          <Link to="/repartos" className="navbar__link" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            🚚 Mis Repartos
          </Link>
        )}

        {/* Enlaces Públicos o Cliente */}
        {(!user || user?.role === 'CLIENT') && (
          <>
            <Link to="/productos" className="navbar__link">Catálogo</Link>
            {user && <Link to="/pedidos" className="navbar__link">Mis Pedidos</Link>}
          </>
        )}

        {/* Usuario y Logout */}
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
    </header>
  )
}
