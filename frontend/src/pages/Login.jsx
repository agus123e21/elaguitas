import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main style={pageStyle}>
      <h1>Ingresar</h1>
      {error && <p style={errorStyle}>{error}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
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
          Contraseña
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button type="submit">Ingresar</button>
      </form>
      <p>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </p>
      <p>
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </main>
  )
}

const pageStyle = { maxWidth: 400, margin: '3rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' }
const errorStyle = { color: '#c0392b' }
