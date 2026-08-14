import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user?.role === 'ADMIN') {
        navigate('/admin')
      } else if (user?.role === 'DRIVER') {
        navigate('/repartos')
      } else {
        navigate('/pedidos')
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
    <div className="page" style={{ maxWidth: 440, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '75vh' }}>
      {/* Brand Header Mobile */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: '22px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            boxShadow: '0 8px 24px rgba(11, 125, 194, 0.25)',
            fontSize: '2.4rem',
            marginBottom: '0.85rem',
          }}
        >
          💧
        </div>
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>El Agüitas</h1>
        <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.92rem' }}>
          Ingresá a tu cuenta operativa o de cliente
        </p>
      </div>

      <div className="card" style={{ padding: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
        {error && (
          <div className="alert alert--error" style={{ marginBottom: '1.25rem' }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Correo Electrónico:</label>
            <input
              className="input"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Contraseña:</label>
              <Link to="/olvide-password" className="muted" style={{ fontSize: '0.78rem' }}>
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
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-touch-large"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Validando…' : 'Ingresar'}
          </button>
        </form>

        {/* Cuentas de Acceso Rápido (44px Touch Targets) */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 0.75rem', letterSpacing: '0.04em' }}>
            Acceso Rápido para Pruebas (1 Clic)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 600, justifyContent: 'space-between', background: '#fffbeb', borderColor: '#fef08a' }}
              onClick={() => fillCredentials('admin@agua.com', '123456')}
            >
              <span>👑 <strong>Admin / Dev</strong></span>
              <span className="muted" style={{ fontSize: '0.78rem' }}>admin@agua.com</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 600, justifyContent: 'space-between', background: '#f0f9ff', borderColor: '#bae6fd' }}
              onClick={() => fillCredentials('repartidor@agua.com', '123456')}
            >
              <span>🚚 <strong>Repartidor</strong></span>
              <span className="muted" style={{ fontSize: '0.78rem' }}>repartidor@agua.com</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 600, justifyContent: 'space-between', background: '#f8fafc', borderColor: '#e2e8f0' }}
              onClick={() => fillCredentials('juan@cliente.com', '123456')}
            >
              <span>👤 <strong>Cliente</strong></span>
              <span className="muted" style={{ fontSize: '0.78rem' }}>juan@cliente.com</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem' }}>
        <span className="muted">¿No tenés una cuenta? </span>
        <Link to="/registro" style={{ fontWeight: 600 }}>Crear cuenta</Link>
      </div>
    </div>
  )
}
