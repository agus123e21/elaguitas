import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyOrders, getOrdersByStatus, changeOrderStatus } from '../services/orders.js'

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'En camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const fmtMoney = (n) => `$${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`

export default function DriverOrders() {
  const { user, token } = useAuth()
  const [filter, setFilter] = useState('OUT_FOR_DELIVERY')
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [completingId, setCompletingId] = useState(null)
  const [deliveredModal, setDeliveredModal] = useState({ open: false, order: null, returnedContainers: 0, notes: '' })

  function load() {
    setLoading(true)
    setError(null)
    const fetchFn = filter ? getOrdersByStatus : getMyOrders
    fetchFn(filter, token)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [token, filter])

  // Count stats
  const stats = useMemo(() => {
    return {
      total: orders.length,
      out: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
      pending: orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    }
  }, [orders])

  async function handleStartDelivery(orderId) {
    try {
      setCompletingId(orderId)
      await changeOrderStatus(orderId, 'OUT_FOR_DELIVERY', token)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setCompletingId(null)
    }
  }

  async function handleConfirmDelivered() {
    if (!deliveredModal.order) return
    try {
      setCompletingId(deliveredModal.order.id)
      await changeOrderStatus(deliveredModal.order.id, 'DELIVERED', token)
      setDeliveredModal({ open: false, order: null, returnedContainers: 0, notes: '' })
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setCompletingId(null)
    }
  }

  function getMapsUrl(order) {
    const fullAddress = `${order.street || ''}, ${order.city || ''}`.trim()
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
  }

  function getWhatsAppUrl(order) {
    const cleanPhone = (order.customer_phone || '').replace(/\D/g, '')
    const message = `Hola ${order.customer_name || 'Cliente'}, soy ${user?.name || 'tu repartidor'} de El Agüitas 💧. Estoy en camino a tu domicilio (${order.street}) con tu pedido #${order.id}.`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }

  const tabs = [
    { value: 'OUT_FOR_DELIVERY', label: '🚀 En camino', count: stats.out },
    { value: 'PENDING', label: '⏳ Pendientes', count: stats.pending },
    { value: 'DELIVERED', label: '✅ Entregados', count: stats.delivered },
    { value: '', label: '📋 Todos', count: stats.total },
  ]

  return (
    <div className="page" style={{ maxWidth: 680, paddingBottom: '5rem' }}>
      {/* Header del Repartidor */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>🚚 Hoja de Ruta</h1>
          <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
            Repartidor: <strong>{user?.name || 'Asignado'}</strong>
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>
          🔄 {loading ? 'Actualizando…' : 'Refrescar'}
        </button>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Selector de Pestañas / Filtros */}
      <div className="tabs" style={{ marginBottom: '1.25rem', overflowX: 'auto', display: 'flex', gap: '0.35rem' }}>
        {tabs.map((t) => (
          <button
            key={t.label}
            className={`tabs__btn ${filter === t.value ? 'tabs__btn--active' : ''}`}
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.8rem', whiteSpace: 'nowrap' }}
            onClick={() => setFilter(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && orders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="muted">Cargando tus pedidos asignados…</p>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <p style={{ fontWeight: 600, margin: 0 }}>No hay pedidos en esta sección</p>
          <p className="muted" style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            {filter ? 'Probá cambiando el filtro o refrescando la lista.' : 'No tenés entregas asignadas actualmente.'}
          </p>
        </div>
      )}

      {/* Lista de Pedidos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.map((o) => {
          const isOut = o.status === 'OUT_FOR_DELIVERY'
          const isDelivered = o.status === 'DELIVERED'

          return (
            <div
              key={o.id}
              className={`card order order--${o.status}`}
              style={{
                padding: '1.15rem',
                borderLeft: isOut ? '5px solid var(--primary)' : isDelivered ? '5px solid var(--success)' : '5px solid var(--border)',
                background: isOut ? '#fcfdfe' : '#ffffff',
              }}
            >
              {/* Header de la tarjeta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>ORDEN #{o.id}</span>
                  <h2 style={{ fontSize: '1.2rem', margin: '0.1rem 0 0', color: 'var(--text)' }}>
                    {o.customer_name || 'Cliente sin nombre'}
                  </h2>
                </div>
                <span className={`badge badge--${o.status}`} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>

              {/* Dirección y Destino */}
              <div style={{ background: 'var(--bg)', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '0.85rem' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>
                  📍 {o.street || 'Dirección no especificada'}
                </p>
                {o.city && <p className="muted" style={{ margin: '0.15rem 0 0', fontSize: '0.8rem' }}>{o.city}</p>}
                {o.notes && (
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--primary-dark)', background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    📝 <em>{o.notes}</em>
                  </p>
                )}
              </div>

              {/* Botones de Integración Móvil: Google Maps & WhatsApp */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <a
                  href={getMapsUrl(o)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  🗺️ Google Maps
                </a>

                {o.customer_phone ? (
                  <a
                    href={getWhatsAppUrl(o)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, borderColor: '#25D366', color: '#128C7E' }}
                  >
                    💬 WhatsApp
                  </a>
                ) : (
                  <button className="btn btn-outline btn-sm" disabled style={{ fontSize: '0.85rem' }}>
                    💬 Sin teléfono
                  </button>
                )}
              </div>

              {/* Productos / Items a entregar */}
              {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                <div style={{ marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
                    Productos a Entregar:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {o.items.map((it, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-dark)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                        }}
                      >
                        💧 {it.quantity}x {it.productName || it.product_name || 'Bidón'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Total y Método de Pago */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  Cobro: <strong style={{ color: 'var(--text)' }}>{o.payment_method === 'CASH' ? '💵 Efectivo' : '💳 Transferencia'}</strong>
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {fmtMoney(o.total)}
                </span>
              </div>

              {/* Acciones de Cambio de Estado */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {o.status !== 'OUT_FOR_DELIVERY' && o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    style={{ height: '38px', fontWeight: 600 }}
                    disabled={completingId === o.id}
                    onClick={() => handleStartDelivery(o.id)}
                  >
                    🚀 Iniciar Viaje (En camino)
                  </button>
                )}

                {o.status === 'OUT_FOR_DELIVERY' && (
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    style={{ height: '40px', fontWeight: 600, background: 'var(--success)', borderColor: 'var(--success)' }}
                    disabled={completingId === o.id}
                    onClick={() => setDeliveredModal({ open: true, order: o, returnedContainers: o.containers_delivered || 1, notes: '' })}
                  >
                    ✅ Confirmar Entrega
                  </button>
                )}

                {isDelivered && (
                  <div style={{ width: '100%', textAlign: 'center', padding: '0.4rem', background: '#eaf7ed', color: 'var(--success)', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
                    ✔️ Pedido entregado y cobrado
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Confirmación de Entrega */}
      {deliveredModal.open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: 420, width: '100%', padding: '1.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Confirmar Entrega #{deliveredModal.order?.id}</h2>
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              Cliente: <strong>{deliveredModal.order?.customer_name}</strong>
            </p>

            <div style={{ margin: '1rem 0', padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Monto a cobrar: <strong>{fmtMoney(deliveredModal.order?.total)}</strong>
              </p>
              <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.8rem' }}>
                Método: {deliveredModal.order?.payment_method}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Envases vacíos retirados:</label>
              <input
                className="input"
                type="number"
                min="0"
                value={deliveredModal.returnedContainers}
                onChange={(e) => setDeliveredModal({ ...deliveredModal, returnedContainers: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                className="btn btn-ghost btn-block"
                onClick={() => setDeliveredModal({ open: false, order: null, returnedContainers: 0, notes: '' })}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary btn-block"
                style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                disabled={completingId === deliveredModal.order?.id}
                onClick={handleConfirmDelivered}
              >
                {completingId === deliveredModal.order?.id ? 'Guardando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
