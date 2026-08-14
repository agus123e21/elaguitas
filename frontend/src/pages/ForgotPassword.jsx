import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/auth.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main style={pageStyle}>
      <h1>Recuperar contraseña</h1>
      {sent ? (
        <p>
          Si el email existe, vas a recibir un enlace para restablecer tu contraseña.{' '}
          <Link to="/login">Volver al login</Link>
        </p>
      ) : (
        <>
          {error && <p style={errorStyle}>{error}</p>}
          <form onSubmit={handleSubmit} style={formStyle}>
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit">Enviar enlace</button>
          </form>
          <p>
            <Link to="/login">Volver al login</Link>
          </p>
        </>
      )}
    </main>
  )
}

const pageStyle = { maxWidth: 400, margin: '3rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' }
const errorStyle = { color: '#c0392b' }
