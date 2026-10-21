import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DropletIcon, AlertCircleIcon } from '../components/Icons.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta')
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
          Crear tu Cuenta
        </h1>
        <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.94rem' }}>
          Pedí agua purificada en San Rafael de forma ágil y simple
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
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="name" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
              Nombre y Apellido:
            </label>
            <input
              className="input"
              id="name"
              required
              placeholder="ej: Marcos Gómez"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="email" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
              Correo Electrónico:
            </label>
            <input
              className="input"
              id="email"
              type="email"
              required
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="phone" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
              Teléfono Celular (WhatsApp):
            </label>
            <input
              className="input"
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="ej: 2604123456"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
              style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.4rem' }}>
            <label className="form-label" htmlFor="password" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
              Contraseña (mínimo 6 caracteres):
            </label>
            <input
              className="input"
              id="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            {loading ? 'Creando cuenta…' : 'Registrarme y Comenzar'}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.92rem' }}>
        <span className="muted">¿Ya tenés una cuenta activa? </span>
        <Link to="/login" style={{ fontWeight: 800, color: 'var(--primary)' }}>
          Ingresá acá
        </Link>
      </div>
    </div>
  )
}
