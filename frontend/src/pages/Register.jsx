import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main style={pageStyle}>
      <h1>Crear cuenta</h1>
      {error && <p style={errorStyle}>{error}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>
          Nombre
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Teléfono
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          Contraseña (mínimo 6 caracteres)
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button type="submit">Registrarme</button>
      </form>
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
      </p>
    </main>
  )
}

const pageStyle = { maxWidth: 400, margin: '3rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' }
const errorStyle = { color: '#c0392b' }
