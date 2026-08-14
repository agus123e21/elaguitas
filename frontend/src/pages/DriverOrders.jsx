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
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Mis repartos</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setFilter(t.value)}
            style={
              filter === t.value
                ? { fontWeight: 700, background: '#1a73e8', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }
                : { background: '#fff', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p>Cargando…</p>}

      {orders.length === 0 && !loading && <p>No hay pedidos.</p>}

      {orders.map((o) => (
        <div key={o.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <strong>Pedido #{o.id}</strong>
            <span>{STATUS_LABELS[o.status] || o.status}</span>
          </div>
          <p style={{ margin: '0.4rem 0' }}>
            {o.customer_name} · {o.street}, {o.city}
          </p>
          <p style={{ margin: '0.2rem 0', color: '#555' }}>
            Total {fmtMoney(o.total)} · {o.payment_method}
            {o.containers_delivered > 0 ? ` · +${o.containers_delivered} bidones` : ''}
            {o.containers_returned > 0 ? ` · -${o.containers_returned} bidones` : ''}
          </p>
          <p style={{ margin: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>
            Creado {new Date(o.created_at).toLocaleString('es-AR')}
          </p>

          {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              {o.status !== 'OUT_FOR_DELIVERY' && (
                <button onClick={() => handleStatus(o.id, 'OUT_FOR_DELIVERY')}>Iniciar reparto</button>
              )}
              <button onClick={() => handleStatus(o.id, 'DELIVERED')}>Marcar entregado</button>
            </div>
          )}
        </div>
      ))}
    </main>
  )
}
