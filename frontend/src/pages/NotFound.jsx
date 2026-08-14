import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <h1>404</h1>
        <p className="muted">La página que buscás no existe.</p>
        <Link className="btn btn-primary" to="/">Volver al inicio</Link>
      </div>
    </div>
  )
}
