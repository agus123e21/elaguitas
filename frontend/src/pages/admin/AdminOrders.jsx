import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getOrdersByStatus, changeOrderStatus, assignDriver } from '../../services/orders.js'
import { getUsers } from '../../services/users.js'

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'En reparto',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

const fmtMoney = (n) => `$${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`

export default function AdminOrders() {
  const { token } = useAuth()
  const [filter, setFilter] = useState('')
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [error, setError] = useState(null)

  function load() {
    getOrdersByStatus(filter, token).then(setOrders).catch((e) => setError(e.message))
  }

  useEffect(() => {
    load()
    getUsers(token, { role: 'DRIVER' }).then(setDrivers).catch(() => {})
  }, [token, filter])

  function handleStatus(orderId, status) {
    changeOrderStatus(orderId, status, token).then(load).catch((e) => setError(e.message))
  }

  function handleAssign(orderId, driverId) {
    if (!driverId) return
    assignDriver(orderId, Number(driverId), token).then(load).catch((e) => setError(e.message))
  }

  const tabs = [
    { value: '', label: 'Todos' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'CONFIRMED', label: 'Confirmados' },
    { value: 'PREPARING', label: 'Preparando' },
    { value: 'OUT_FOR_DELIVERY', label: 'En reparto' },
    { value: 'DELIVERED', label: 'Entregados' },
    { value: 'CANCELLED', label: 'Cancelados' },
  ]

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Pedidos</h1>
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

      {orders.length === 0 && <p>No hay pedidos.</p>}

      {orders.map((o) => (
        <div key={o.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <strong>
              Pedido #{o.id} · {o.customer_name}
            </strong>
            <span>{STATUS_LABELS[o.status] || o.status}</span>
          </div>
          <p style={{ margin: '0.4rem 0' }}>
            {o.street}, {o.city} · {o.payment_method} · {fmtMoney(o.total)}
          </p>
          <p style={{ margin: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>
            Creado {new Date(o.created_at).toLocaleString('es-AR')}
            {o.containers_delivered > 0 ? ` · +${o.containers_delivered} bidones` : ''}
            {o.containers_returned > 0 ? ` · -${o.containers_returned} bidones` : ''}
            {o.driver_name ? ` · Repartidor: ${o.driver_name}` : ''}
          </p>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && (
              <select
                value=""
                onChange={(e) => e.target.value && handleStatus(o.id, e.target.value)}
                style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Cambiar estado…</option>
                {STATUS_FLOW.slice(STATUS_FLOW.indexOf(o.status) + 1).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
                <option value="CANCELLED">Cancelar</option>
              </select>
            )}
            {o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && (
              <select
                value=""
                onChange={(e) => e.target.value && handleAssign(o.id, e.target.value)}
                style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Asignar repartidor…</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      ))}
    </main>
  )
}
