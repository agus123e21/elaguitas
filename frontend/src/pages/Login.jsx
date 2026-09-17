import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DropletIcon, ShieldIcon, TruckIcon, UserIcon, AlertCircleIcon, LockIcon } from '../components/Icons.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(email, password)
      const role = data?.user?.role || data?.role
      const fromPath = location.state?.from?.pathname
      if (fromPath && fromPath !== '/login' && fromPath !== '/') {
        navigate(fromPath, { replace: true })
      } else if (role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else if (role === 'DRIVER') {
        navigate('/repartos', { replace: true })
      } else {
        navigate('/productos', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  function fillCredentials(mail, pass) {
    setEmail(mail)
    setPassword(pass)
  }

  return (
    <div
      className="page"
      style={{
        maxWidth: 460,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '80vh',
        paddingBottom: '6rem',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            boxShadow: '0 12px 28px rgba(11, 125, 194, 0.3)',
            marginBottom: '1rem',
          }}
        >
          <DropletIcon size={36} color="#ffffff" />
        </div>
        <h1 style={{ fontSize: '1.9rem', margin: 0, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          El Agüitas
        </h1>
        <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.94rem' }}>
          Plataforma de reparto oficial en San Rafael
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: '1.85rem',
          borderRadius: '32px',
          border: '1px solid rgba(11, 125, 194, 0.12)',
          boxShadow: 'var(--shadow-soft)',
          background: '#ffffff',
        }}
      >
        {error && (
          <div className="alert alert--error" style={{ marginBottom: '1.25rem', borderRadius: '18px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <AlertCircleIcon size={18} />
              <span>{error}</span>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group" style={{ marginBottom: '1.15rem' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>Correo Electrónico:</label>
            <input
              className="input"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', margin: 0 }}>Contraseña:</label>
              <Link to="/olvide-password" className="muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                ¿Olvidaste tu clave?
              </Link>
            </div>
            <input
              className="input"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{
              minHeight: '52px',
              borderRadius: '9999px',
              fontWeight: 900,
              fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(11, 125, 194, 0.28)',
            }}
          >
            {loading ? 'Validando…' : 'Ingresar a mi Cuenta'}
          </button>
        </form>

        {/* Cuentas de Acceso Rápido para Demostración */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.35rem', borderTop: '1px solid #f1f5f9' }}>
          <p
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              textAlign: 'center',
              margin: '0 0 0.85rem',
              letterSpacing: '0.04em',
            }}
          >
            Acceso Rápido con 1 Clic
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                minHeight: '48px',
                fontSize: '0.88rem',
                justifyContent: 'space-between',
                background: '#fffdf5',
                borderColor: '#fef08a',
                borderRadius: '18px',
                padding: '0.7rem 1.1rem',
              }}
              onClick={() => fillCredentials('admin@agua.com', '123456')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldIcon size={15} color="#92400e" />
                </div>
                <strong style={{ color: '#92400e' }}>Admin / Dirección</strong>
              </span>
              <span className="muted" style={{ fontSize: '0.76rem' }}>admin@agua.com</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{
                minHeight: '48px',
                fontSize: '0.88rem',
                justifyContent: 'space-between',
                background: '#f0f9ff',
                borderColor: '#bae6fd',
                borderRadius: '18px',
                padding: '0.7rem 1.1rem',
              }}
              onClick={() => fillCredentials('repartidor@agua.com', '123456')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TruckIcon size={15} color="var(--primary)" />
                </div>
                <strong style={{ color: 'var(--primary)' }}>Repartidor Chofer</strong>
              </span>
              <span className="muted" style={{ fontSize: '0.76rem' }}>repartidor@agua.com</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{
                minHeight: '48px',
                fontSize: '0.88rem',
                justifyContent: 'space-between',
                background: '#f8fafc',
                borderColor: '#e2e8f0',
                borderRadius: '18px',
                padding: '0.7rem 1.1rem',
              }}
              onClick={() => fillCredentials('juan@cliente.com', '123456')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={15} color="#334155" />
                </div>
                <strong style={{ color: '#334155' }}>Juan Cliente</strong>
              </span>
              <span className="muted" style={{ fontSize: '0.76rem' }}>juan@cliente.com</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.92rem' }}>
        <span className="muted">¿No tenés una cuenta todavía? </span>
        <Link to="/registro" style={{ fontWeight: 800, color: 'var(--primary)' }}>
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}
