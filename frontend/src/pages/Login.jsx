import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      const role = data.user?.role
      if (role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else if (role === 'DRIVER') {
        navigate('/repartos', { replace: true })
      } else {
        navigate('/pedidos', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  function handleQuickFill(email, password) {
    setForm({ email, password })
    setError(null)
  }

  return (
    <div className="page" style={{ maxWidth: 440, margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>💧</div>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>El Agüitas</h1>
        <p className="muted" style={{ margin: '0.25rem 0 0' }}>Sistema Operativo y de Reparto</p>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Credenciales de Prueba Rápidas para Validación */}
      <div className="card" style={{ padding: '0.85rem', marginBottom: '1rem', background: 'var(--primary-light)', border: '1px solid var(--border)' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
          ⚡ Atajo de Acceso Rápido (Cuentas de la DB):
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', background: '#fff' }}
            onClick={() => handleQuickFill('admin@agua.com', '123456')}
          >
            👑 Admin / Dev
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', background: '#fff' }}
            onClick={() => handleQuickFill('repartidor@agua.com', '123456')}
          >
            🚚 Repartidor
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', background: '#fff' }}
            onClick={() => handleQuickFill('juan@cliente.com', '123456')}
          >
            👤 Cliente
          </button>
        </div>
      </div>

      <form className="form card" onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Correo Electrónico</label>
          <input
            className="input"
            id="email"
            type="email"
            required
            placeholder="ej: admin@agua.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Contraseña</label>
          <input
            className="input"
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={loading}
          style={{ height: '44px', fontSize: '1rem', fontWeight: 600 }}
        >
          {loading ? 'Verificando con Supabase…' : 'Iniciar Sesión'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          ¿Sos cliente nuevo? <Link to="/register">Registrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
