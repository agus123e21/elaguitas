import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrder } from '../services/orders.js'

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

export default function OrderDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOrder(id, token).then(setOrder).catch((e) => setError(e.message))
  }, [id, token])

  if (error) {
    return (
      <div className="page" style={{ maxWidth: 640 }}>
        <p className="alert alert--error">{error}</p>
        <Link className="btn btn-outline btn-sm" to="/pedidos">Volver a mis pedidos</Link>
      </div>
    )
  }

  if (!order) {
    return <p className="muted" style={{ padding: '1rem' }}>Cargando…</p>
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1>Pedido #{order.id}</h1>
      <div className={`card order order--${order.status}`}>
        <p>
          Estado: <span className={`badge badge--${order.status}`}>{STATUS_LABELS[order.status] || order.status}</span>
        </p>
        <p>Dirección: {order.street}, {order.city}</p>
        <p>
          Bidones: {order.containers_delivered} a entregar / {order.containers_returned} a retirar
        </p>
        <p>Pago: {order.payment_method}</p>
      </div>

      <div className="card">
        <h2 className="card__title">Detalle</h2>
        {order.items.map((i) => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '0.4rem 0' }}>
            <span>
              {i.quantity} x {i.product_name}
            </span>
            <span>{formatPrice(i.subtotal)}</span>
          </div>
        ))}
        <p>Subtotal: {formatPrice(order.subtotal)}</p>
        <p>Envío: {formatPrice(order.delivery_fee)}</p>
        {Number(order.discount) > 0 && <p className="text-success">Descuento: -{formatPrice(order.discount)}</p>}
        <p style={{ fontWeight: 700 }}>Total: {formatPrice(order.total)}</p>
      </div>

      <Link className="btn btn-outline btn-sm" to="/pedidos">Volver a mis pedidos</Link>
    </div>
  )
}
