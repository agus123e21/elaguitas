import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  UserIcon,
  TruckIcon,
  ShieldIcon,
  SparklesIcon,
  CheckIcon,
  ChevronRightIcon,
  DropletIcon,
  ShoppingBagIcon,
  LogOutIcon,
} from '../components/Icons.jsx'

export default function DemoPage() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const [loadingRole, setLoadingRole] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  async function handleSwitch(email, roleName, targetPath) {
    setLoadingRole(roleName)
    try {
      await login(email, '123456')
      setSuccessMsg(`Sesión cambiada a ${roleName}`)
      setTimeout(() => {
        navigate(targetPath)
      }, 600)
    } catch {
      // Si falla login, navegar directamente
      navigate(targetPath)
    } finally {
      setLoadingRole(null)
    }
  }

  return (
    <div className="page" style={{ maxWidth: '540px', margin: '0 auto', padding: '1.5rem 1rem 6.5rem' }}>
      {/* Encabezado de la Demo */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.65rem',
          }}
        >
          <SparklesIcon size={14} color="var(--primary)" />
          <span>Panel de Demostración y Pitching</span>
        </div>
        <h1 style={{ fontSize: '1.7rem', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
          Selector de Roles para la Demo
        </h1>
        <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>
          Alterná en 1 clic entre las 3 perspectivas del sistema sin escribir contraseñas.
        </p>
      </div>

      {/* Alerta de éxito si se cambió de rol */}
      {successMsg && (
        <div className="alert alert--success" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <CheckIcon size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Estado Actual */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Sesión Actual:
          </span>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
            {user ? `${user.name} (${user.role})` : 'Invitado (Sin sesión)'}
          </div>
        </div>

        {user && (
          <button
            onClick={logout}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--danger)' }}
          >
            <LogOutIcon size={14} />
            <span>Salir</span>
          </button>
        )}
      </div>

      {/* 3 Tarjetas de Roles con 1 Clic */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {/* Rol 1: Cliente */}
        <div
          onClick={() => handleSwitch('juan@cliente.com', 'Cliente (Juan)', '/')}
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.25rem',
            border: user?.role === 'CLIENT' ? '2px solid var(--primary)' : '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserIcon size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>1. Vista Cliente</strong>
                {user?.role === 'CLIENT' && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'var(--primary)', color: '#fff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                    ACTIVO
                  </span>
                )}
              </div>
              <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.82rem' }}>
                Portada San Rafael, catálogo, modal y checkout de 20L.
              </p>
            </div>
          </div>
          <ChevronRightIcon size={18} color="var(--primary)" />
        </div>

        {/* Rol 2: Repartidor */}
        <div
          onClick={() => handleSwitch('repartidor@agua.com', 'Repartidor (Carlos)', '/repartos')}
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.25rem',
            border: user?.role === 'DRIVER' ? '2px solid #10b981' : '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TruckIcon size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>2. Vista Chofer / Reparto</strong>
                {user?.role === 'DRIVER' && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#10b981', color: '#fff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                    ACTIVO
                  </span>
                )}
              </div>
              <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.82rem' }}>
                Hoja de ruta, aviso WhatsApp 1-tap, GPS y retiro de vacíos.
              </p>
            </div>
          </div>
          <ChevronRightIcon size={18} color="#10b981" />
        </div>

        {/* Rol 3: Admin */}
        <div
          onClick={() => handleSwitch('admin@agua.com', 'Admin (Dirección)', '/admin')}
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.25rem',
            border: user?.role === 'ADMIN' ? '2px solid #f59e0b' : '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                background: '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldIcon size={24} color="#d97706" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>3. Vista Administración</strong>
                {user?.role === 'ADMIN' && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#f59e0b', color: '#fff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                    ACTIVO
                  </span>
                )}
              </div>
              <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.82rem' }}>
                Despacho de flota, métricas de recaudación y base de datos.
              </p>
            </div>
          </div>
          <ChevronRightIcon size={18} color="#d97706" />
        </div>
      </div>

      {/* Enlaces Rápidos a Vistas Principales */}
      <div style={{ background: 'var(--bg)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--border)' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.65rem' }}>
          Accesos Rápidos a Pantallas:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <Link to="/" className="btn btn-outline btn-sm" style={{ minHeight: '38px', justifyContent: 'center' }}>
            Portada San Rafael
          </Link>
          <Link to="/productos" className="btn btn-outline btn-sm" style={{ minHeight: '38px', justifyContent: 'center' }}>
            Catálogo
          </Link>
          <Link to="/carrito" className="btn btn-outline btn-sm" style={{ minHeight: '38px', justifyContent: 'center' }}>
            Carrito
          </Link>
          <Link to="/repartos" className="btn btn-outline btn-sm" style={{ minHeight: '38px', justifyContent: 'center' }}>
            Mis Repartos
          </Link>
        </div>
      </div>
    </div>
  )
}
