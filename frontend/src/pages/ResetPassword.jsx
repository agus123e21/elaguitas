import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/auth.js'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await resetPassword(token, password)
      setDone(true)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!token) {
    return (
      <main style={pageStyle}>
        <p>Enlace inválido. <Link to="/forgot-password">Solicitá uno nuevo</Link></p>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <h1>Nueva contraseña</h1>
      {error && <p style={errorStyle}>{error}</p>}
      {done && <p>Contraseña actualizada. {<Link to="/login">Ingresá</Link>}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>
          Nueva contraseña (mínimo 6 caracteres)
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Actualizar contraseña</button>
      </form>
    </main>
  )
}

const pageStyle = { maxWidth: 400, margin: '3rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' }
const errorStyle = { color: '#c0392b' }
