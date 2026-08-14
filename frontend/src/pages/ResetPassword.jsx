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
      <div className="page" style={{ maxWidth: 420 }}>
        <p className="muted">
          Enlace inválido. <Link to="/forgot-password">Solicitá uno nuevo</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h1>Nueva contraseña</h1>
      {error && <p className="alert alert--error">{error}</p>}
      {done && (
        <p className="text-success">
          Contraseña actualizada. <Link to="/login">Ingresá</Link>
        </p>
      )}
      <form className="form card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Nueva contraseña (mínimo 6 caracteres)</label>
          <input
            className="input"
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit">Actualizar contraseña</button>
      </form>
    </div>
  )
}
