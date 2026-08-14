import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #ddd',
      }}
    >
      <Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>
        Agua
      </Link>

      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/productos">Productos</Link>
        {user && user.role === 'CLIENT' && <Link to="/pedidos">Mis pedidos</Link>}
        {user && user.role === 'CLIENT' && <Link to="/direcciones">Direcciones</Link>}
        {user && user.role === 'CLIENT' && <Link to="/bidones">Bidones</Link>}
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
