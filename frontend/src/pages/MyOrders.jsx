import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyOrders, repeatOrder } from '../services/orders.js'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'En preparación',
  OUT_FOR_DELIVERY: 'En reparto',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

export default function MyOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  function load() {
    getMyOrders(token).then(setOrders).catch((e) => setError(e.message))
  }

  useEffect(load, [token])

  function handleRepeat(id) {
    repeatOrder(id, token).then(() => load()).catch((e) => setError(e.message))
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Mis pedidos</h1>
      {error && <p className="alert alert--error">{error}</p>}
      {orders.length === 0 && (
        <p className="muted">
          No hiciste pedidos todavía. <Link to="/productos">Ver productos</Link>
        </p>
      )}
      {orders.map((o) => (
        <div key={o.id} className={`card order order--${o.status}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <strong>Pedido #{o.id}</strong>
            <span className={`badge badge--${o.status}`}>{STATUS_LABELS[o.status] || o.status}</span>
          </div>
          <p className="muted">
            {o.street}
          </p>
          <p className="muted text-sm">
            {o.containers_delivered > 0 && `${o.containers_delivered} bidones entregados `}
            {o.containers_returned > 0 && `${o.containers_returned} retirados `}
            · {new Date(o.created_at).toLocaleString('es-AR')}
          </p>
          <p style={{ fontWeight: 700 }}>{formatPrice(o.total)}</p>
          <div className="form-inline">
            <Link className="btn btn-outline btn-sm" to={`/pedidos/${o.id}`}>Ver detalle</Link>
            <button className="btn btn-ghost btn-sm" onClick={() => handleRepeat(o.id)}>Repetir pedido</button>
          </div>
        </div>
      ))}
    </div>
  )
}
