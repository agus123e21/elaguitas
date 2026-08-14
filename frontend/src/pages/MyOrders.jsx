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
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Mis pedidos</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {orders.length === 0 && <p>No hiciste pedidos todavía. <Link to="/productos">Ver productos</Link></p>}
      {orders.map((o) => (
        <div key={o.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Pedido #{o.id}</strong>
            <span>{new Date(o.created_at).toLocaleString('es-AR')}</span>
          </div>
          <p style={{ margin: '0.25rem 0' }}>
            {o.street} — {STATUS_LABELS[o.status] || o.status}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            {o.containers_delivered > 0 && `${o.containers_delivered} bidones entregados `}
            {o.containers_returned > 0 && `${o.containers_returned} retirados `}
          </p>
          <p style={{ fontWeight: 700, margin: '0.25rem 0' }}>{formatPrice(o.total)}</p>
          <Link to={`/pedidos/${o.id}`}>Ver detalle</Link>{' '}
          <button onClick={() => handleRepeat(o.id)}>Repetir pedido</button>
        </div>
      ))}
    </main>
  )
}
