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
    <div className="page" style={{ maxWidth: 420 }}>
      <h1>Recuperar contraseña</h1>
      {sent ? (
        <div className="card">
          <p className="text-success">
            Si el email existe, vas a recibir un enlace para restablecer tu contraseña.
          </p>
          <Link className="btn btn-outline" to="/login">Volver al login</Link>
        </div>
      ) : (
        <>
          {error && <p className="alert alert--error">{error}</p>}
          <form className="form card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                className="input"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-block" type="submit">Enviar enlace</button>
          </form>
          <p className="muted">
            <Link to="/login">Volver al login</Link>
          </p>
        </>
      )}
    </div>
  )
}
