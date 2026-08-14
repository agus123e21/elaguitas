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
    <div className="page">
      <section className="hero">
        <h1>Agua</h1>
        <p>
          Plataforma de venta y reparto de agua en bidones. Pedí online y coordiná la entrega a
          domicilio.
        </p>
        {user ? (
          <p>
            Hola, {user.name} <span className="navbar__role">{user.role}</span>
          </p>
        ) : (
          <p>
            <Link className="btn btn-primary" to="/login">Ingresá</Link>{' '}
            <Link className="btn btn-outline" to="/register">Creá una cuenta</Link>
          </p>
        )}
      </section>

      <div className="grid grid--cards">
        <Link className="card" to="/productos">
          <h3>Productos</h3>
          <p className="muted">Bidones y packs disponibles para entrega a domicilio.</p>
        </Link>
        <Link className="card" to="/promociones">
          <h3>Promociones</h3>
          <p className="muted">Descuentos, packs y envío gratis por tiempo limitado.</p>
        </Link>
        {user && (
          <Link className="card" to={user.role === 'CLIENT' ? '/cliente' : user.role === 'DRIVER' ? '/repartidor' : '/admin'}>
            <h3>Mi área</h3>
            <p className="muted">Pedidos, direcciones, suscripciones y más.</p>
          </Link>
        )}
      </div>

      <section className="card">
        <h2 className="card__title">Estado del sistema</h2>
        {error && <p className="alert alert--error">Error de conexión con el backend: {error}</p>}
        {!error && !health && <p className="muted">Consultando API…</p>}
        {health && (
          <ul>
            <li>API: <strong>{health.status}</strong></li>
            <li>Base de datos: <strong>{health.db}</strong></li>
            <li>Servicio: {health.service}</li>
          </ul>
        )}
      </section>
    </div>
  )
}
