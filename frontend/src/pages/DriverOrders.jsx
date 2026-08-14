import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyOrders, getOrdersByStatus, changeOrderStatus } from '../services/orders.js'

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'En reparto',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const fmtMoney = (n) => `$${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`

export default function DriverOrders() {
  const { token } = useAuth()
  const [filter, setFilter] = useState('OUT_FOR_DELIVERY')
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function load() {
    setLoading(true)
    const fetchFn = filter ? getOrdersByStatus : getMyOrders
    fetchFn(filter, token)
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [token, filter])

  function handleStatus(orderId, status) {
    changeOrderStatus(orderId, status, token)
      .then(load)
      .catch((e) => setError(e.message))
  }

  const tabs = [
    { value: 'OUT_FOR_DELIVERY', label: 'En reparto' },
    { value: 'DELIVERED', label: 'Entregados' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: '', label: 'Todos' },
  ]

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <h1>Mis repartos</h1>
      {error && <p className="alert alert--error">{error}</p>}

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.label}
            className={`tabs__btn ${filter === t.value ? 'tabs__btn--active' : ''}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Cargando…</p>}

      {orders.length === 0 && !loading && <p className="muted">No hay pedidos.</p>}

      {orders.map((o) => (
        <div key={o.id} className={`card order order--${o.status}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <strong>Pedido #{o.id}</strong>
            <span className={`badge badge--${o.status}`}>{STATUS_LABELS[o.status] || o.status}</span>
          </div>
          <p>
            {o.customer_name} · {o.street}, {o.city}
          </p>
          <p className="muted text-sm">
            Total {fmtMoney(o.total)} · {o.payment_method}
            {o.containers_delivered > 0 ? ` · +${o.containers_delivered} bidones` : ''}
            {o.containers_returned > 0 ? ` · -${o.containers_returned} bidones` : ''}
            · Creado {new Date(o.created_at).toLocaleString('es-AR')}
          </p>

          {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
            <div className="form-inline">
              {o.status !== 'OUT_FOR_DELIVERY' && (
                <button className="btn btn-outline btn-sm" onClick={() => handleStatus(o.id, 'OUT_FOR_DELIVERY')}>Iniciar reparto</button>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => handleStatus(o.id, 'DELIVERED')}>Marcar entregado</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
