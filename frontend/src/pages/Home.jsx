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
      {/* Hero Banner Mobile First */}
      <section className="hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-pill)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.85rem' }}>
          <span>💧</span> AGUA PURIFICADA A DOMICILIO
        </div>

        <h1>El Agüitas</h1>
        <p>
          Reparto programado y pedidos de bidones de agua directamente en tu puerta. Rápido, fresco y con control de envases.
        </p>

        {user ? (
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {user.role === 'ADMIN' && (
              <Link className="btn btn-primary" to="/admin">
                🛡️ Consola Administrador
              </Link>
            )}
            {user.role === 'DRIVER' && (
              <Link className="btn btn-primary" to="/repartos">
                🚚 Hoja de Repartos
              </Link>
            )}
            <Link className="btn btn-outline" to="/productos">
              💧 Ver Catálogo
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            <Link className="btn btn-primary" to="/login">
              Ingresar al Sistema
            </Link>
            <Link className="btn btn-outline" to="/productos">
              Explorar Catálogo
            </Link>
          </div>
        )}
      </section>

      {/* Accesos Rápidos en Cuadrícula Mobile */}
      <div className="grid grid--cards" style={{ marginBottom: '1.5rem' }}>
        <Link className="card" to="/productos" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>💧</div>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Catálogo de Productos</h3>
          <p className="muted" style={{ margin: '0.25rem 0 0' }}>
            Bidones de 20L, 12L, 6L y packs en 2 columnas con stock inmediato.
          </p>
        </Link>

        <Link className="card" to="/repartos" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🚚</div>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Hoja de Ruta Repartidor</h3>
          <p className="muted" style={{ margin: '0.25rem 0 0' }}>
            Navegación GPS con Google Maps y contacto 1-tap por WhatsApp.
          </p>
        </Link>

        <Link className="card" to="/admin" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🛡️</div>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>Consola y Base de Datos</h3>
          <p className="muted" style={{ margin: '0.25rem 0 0' }}>
            Despacho de pedidos, creación de usuarios y telemetría de Supabase.
          </p>
        </Link>
      </div>

      {/* Estado del Backend y Base de Datos */}
      <section className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>⚡</span> Estado de Conexión del Sistema
        </h3>
        {error && <p className="alert alert--error">Error de conexión con el backend: {error}</p>}
        {!error && !health && <p className="muted">Consultando API y Supabase…</p>}
        {health && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            <div>
              <span className="muted">API REST: </span>
              <strong style={{ color: health.status === 'ok' ? 'var(--success)' : 'var(--danger)' }}>
                {health.status === 'ok' ? '🟢 Operativa' : '🔴 Degradada'}
              </strong>
            </div>
            <div>
              <span className="muted">Base de Datos: </span>
              <strong style={{ color: health.db === 'connected' ? 'var(--success)' : 'var(--danger)' }}>
                {health.db === 'connected' ? '🟢 Supabase Conectado' : '🔴 Desconectado'}
              </strong>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
