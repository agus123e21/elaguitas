import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DropletIcon, AlertCircleIcon, LockIcon } from '../components/Icons.jsx'

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
            width: 64,
            height: 64,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 12px 28px rgba(11, 125, 194, 0.3)',
            marginBottom: '1rem',
          }}
        >
          <DropletIcon size={32} />
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem', letterSpacing: '-0.025em' }}>
          El Agüitas
        </h1>
        <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>
          Agua pura envasada en San Rafael, Mendoza
        </p>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 1.5rem',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
        }}
      >
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.88rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
            }}
          >
            <AlertCircleIcon size={18} color="#dc2626" />
            <span>{error}</span>
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
