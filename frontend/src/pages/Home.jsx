import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/health')
      .then(setHealth)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main style={{ maxWidth: 640, margin: '4rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1>Agua</h1>
      <p>Plataforma de venta y reparto de agua en bidones.</p>

      {user ? (
        <p>
          Hola, {user.name} ({user.role}).{' '}
          {user.role === 'CLIENT' && <Link to="/cliente">Ir a mi área</Link>}
        </p>
      ) : (
        <p>
          <Link to="/login">Ingresá</Link> o <Link to="/register">creá una cuenta</Link>
        </p>
      )}

      <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Estado del sistema</h2>
        {error && <p style={{ color: '#c0392b' }}>Error de conexión con el backend: {error}</p>}
        {!error && !health && <p>Consultando API…</p>}
        {health && (
          <ul>
            <li>API: <strong>{health.status}</strong></li>
            <li>Base de datos: <strong>{health.db}</strong></li>
            <li>Servicio: {health.service}</li>
          </ul>
        )}
      </section>
    </main>
  )
}
