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
    const total = orders.length
    const delivered = orders.filter((o) => o.status === 'DELIVERED').length
    const out = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length
    const pending = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length
    const progressPercent = total > 0 ? Math.round((delivered / total) * 100) : 0
    return { total, delivered, out, pending, progressPercent }
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
    <div className="page" style={{ maxWidth: 640 }}>
      {/* Header Mobile con Saludo y Vehículo */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              PANEL OPERATIVO
            </span>
            <h1 style={{ fontSize: '1.55rem', margin: '0.1rem 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🚚</span> {user?.name || 'Repartidor'}
            </h1>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={load}
            disabled={loading}
            style={{ borderRadius: 'var(--radius-pill)', minHeight: '36px' }}
          >
            🔄 {loading ? 'Cargando…' : 'Actualizar'}
          </button>
        </div>

        {/* Barra de Progreso de Entregas del Día (Peak-End Rule) */}
        <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginTop: '0.85rem', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <span className="muted">Progreso de entregas:</span>
            <span style={{ color: 'var(--primary)' }}>
              {stats.delivered} de {stats.total} completadas ({stats.progressPercent}%)
            </span>
          </div>
          <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${stats.progressPercent}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                borderRadius: '4px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Selector Táctil de Pestañas (Filtros en Píldora) */}
      <div className="tabs" style={{ marginBottom: '1.25rem' }}>
        {tabs.map((t) => (
          <button
            key={t.label}
            className={`tabs__btn ${filter === t.value ? 'tabs__btn--active' : ''}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label} {t.count > 0 && <span style={{ opacity: 0.85, marginLeft: '3px' }}>({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Estados de Carga y Vacío */}
      {loading && orders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p className="muted" style={{ margin: 0 }}>Cargando tu hoja de ruta…</p>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.25rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 style={{ margin: 0 }}>Sin pedidos pendientes aquí</h3>
          <p className="muted" style={{ margin: '0.35rem 0 1.25rem' }}>
            {filter ? 'No hay entregas con este filtro.' : '¡Todo entregado por el momento!'}
          </p>
          {filter && (
            <button className="btn btn-outline btn-sm" onClick={() => setFilter('')}>
              Ver todos los pedidos
            </button>
          )}
        </div>
      )}

      {/* Lista de Tarjetas de Entrega (Mobile-First Touch Cards) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {orders.map((o) => {
          const isOut = o.status === 'OUT_FOR_DELIVERY'
          const isDelivered = o.status === 'DELIVERED'

          return (
            <div
              key={o.id}
              className={`card order order--${o.status}`}
              style={{
                padding: '1.25rem',
                borderLeft: isOut
                  ? '6px solid var(--primary)'
                  : isDelivered
                  ? '6px solid var(--success)'
                  : '6px solid var(--border)',
                background: isOut ? '#fdfefe' : '#ffffff',
                boxShadow: isOut ? 'var(--shadow-md)' : 'var(--shadow)',
              }}
            >
              {/* Header de la tarjeta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    ENTREGA #{o.id}
                  </span>
                  <h2 style={{ fontSize: '1.25rem', margin: '0.15rem 0 0', color: 'var(--text)' }}>
                    {o.customer_name || 'Cliente'}
                  </h2>
                </div>
                <span className={`badge badge--${o.status}`}>
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>

              {/* Bloque de Destino y Dirección */}
              <div style={{ background: 'var(--bg)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.9rem' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.98rem', color: 'var(--text)' }}>
                  📍 {o.street || 'Dirección no especificada'}
                </p>
                {o.city && (
                  <p className="muted" style={{ margin: '0.15rem 0 0', fontSize: '0.82rem' }}>
                    {o.city}
                  </p>
                )}
                {o.notes && (
                  <div style={{ marginTop: '0.45rem', padding: '0.35rem 0.6rem', background: '#fff', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--primary-dark)' }}>
                    📝 <strong>Nota:</strong> {o.notes}
                  </div>
                )}
              </div>

              {/* Botones de Acción Rápida (Thumb Zone: Maps & WhatsApp) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.95rem' }}>
                <a
                  href={getMapsUrl(o)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ minHeight: '46px', fontSize: '0.88rem', fontWeight: 700, borderColor: '#93c5fd' }}
                >
                  🗺️ Google Maps
                </a>

                {o.customer_phone ? (
                  <a
                    href={getWhatsAppUrl(o)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ minHeight: '46px', fontSize: '0.88rem', fontWeight: 700, borderColor: '#86efac', color: '#15803d' }}
                  >
                    💬 WhatsApp
                  </a>
                ) : (
                  <button className="btn btn-outline" disabled style={{ minHeight: '46px', fontSize: '0.88rem' }}>
                    💬 Sin teléfono
                  </button>
                )}
              </div>

              {/* Lista de Bidones / Productos a entregar */}
              {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                <div style={{ marginBottom: '0.9rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>
                    Carga a entregar:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {o.items.map((it, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-dark)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          padding: '0.3rem 0.65rem',
                          borderRadius: '8px',
                        }}
                      >
                        💧 {it.quantity}x {it.productName || it.product_name || 'Bidón'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Total y Método de Pago */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
                <span className="muted" style={{ fontSize: '0.88rem' }}>
                  Cobro: <strong style={{ color: 'var(--text)' }}>{o.payment_method === 'CASH' ? '💵 Efectivo' : '💳 Transferencia'}</strong>
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtMoney(o.total)}
                </span>
              </div>

              {/* Botones de Transición de Estado (48px Touch Target) */}
              <div style={{ marginTop: '0.25rem' }}>
                {o.status !== 'OUT_FOR_DELIVERY' && o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                  <button
                    className="btn btn-primary btn-block btn-touch-large"
                    disabled={completingId === o.id}
                    onClick={() => handleStartDelivery(o.id)}
                  >
                    🚀 Iniciar Viaje (En camino)
                  </button>
                )}

                {o.status === 'OUT_FOR_DELIVERY' && (
                  <button
                    className="btn btn-success btn-block btn-touch-large"
                    disabled={completingId === o.id}
                    onClick={() => setDeliveredModal({ open: true, order: o, returnedContainers: o.containers_delivered || 1, notes: '' })}
                  >
                    ✅ Confirmar Entrega
                  </button>
                )}

                {isDelivered && (
                  <div style={{ width: '100%', textAlign: 'center', padding: '0.65rem', background: '#dcfce7', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem' }}>
                    ✔️ Entregado y cobrado
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Mobile para Confirmación de Entrega */}
      {deliveredModal.open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0',
          zIndex: 1000,
        }}>
          <div
            className="card"
            style={{
              maxWidth: 520,
              width: '100%',
              padding: '1.5rem',
              background: '#ffffff',
              borderRadius: '24px 24px 0 0',
              margin: 0,
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideUp 0.25s ease-out',
            }}
          >
            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 1.25rem' }} />
            
            <h2 style={{ fontSize: '1.35rem', marginTop: 0, marginBottom: '0.25rem' }}>
              Confirmar Entrega #{deliveredModal.order?.id}
            </h2>
            <p className="muted" style={{ margin: '0 0 1rem', fontSize: '0.9rem' }}>
              Cliente: <strong>{deliveredModal.order?.customer_name}</strong>
            </p>

            <div style={{ margin: '0.75rem 0 1.25rem', padding: '0.85rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="muted">Monto total a cobrar:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                  {fmtMoney(deliveredModal.order?.total)}
                </strong>
              </div>
              <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.82rem' }}>
                Método: {deliveredModal.order?.payment_method === 'CASH' ? 'Efectivo' : 'Transferencia'}
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Envases vacíos retirados:</label>
              <input
                className="input"
                type="number"
                min="0"
                value={deliveredModal.returnedContainers}
                onChange={(e) => setDeliveredModal({ ...deliveredModal, returnedContainers: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ minHeight: '48px' }}
                onClick={() => setDeliveredModal({ open: false, order: null, returnedContainers: 0, notes: '' })}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                style={{ minHeight: '48px', fontWeight: 700 }}
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
