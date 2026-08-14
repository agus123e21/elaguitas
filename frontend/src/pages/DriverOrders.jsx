import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyOrders, changeOrderStatus, takeOrder } from '../services/orders.js'

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
  const [filter, setFilter] = useState('ALL') // 'ALL', 'AVAILABLE', 'MY_TRIP', 'DELIVERED'
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [deliveredModal, setDeliveredModal] = useState({ open: false, order: null, returnedContainers: 0, notes: '' })

  function showSuccess(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  function load() {
    setLoading(true)
    setError(null)
    getMyOrders(token)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [token])

  // Filtrado de pedidos
  const filteredOrders = useMemo(() => {
    if (filter === 'AVAILABLE') {
      return orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING')
    }
    if (filter === 'MY_TRIP') {
      return orders.filter((o) => o.status === 'OUT_FOR_DELIVERY')
    }
    if (filter === 'DELIVERED') {
      return orders.filter((o) => o.status === 'DELIVERED')
    }
    return orders // 'ALL'
  }, [orders, filter])

  // Estadísticas del Repartidor
  const stats = useMemo(() => {
    const total = orders.length
    const available = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length
    const myTrip = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length
    const delivered = orders.filter((o) => o.status === 'DELIVERED').length
    const progressPercent = total > 0 ? Math.round((delivered / total) * 100) : 0
    return { total, available, myTrip, delivered, progressPercent }
  }, [orders])

  // Tomar un pedido disponible
  async function handleTakeOrder(orderId) {
    try {
      setActionLoadingId(orderId)
      await takeOrder(orderId, token)
      showSuccess(`¡Tomaste el Pedido #${orderId}! Ahora está en tu viaje.`)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Cambiar estado (Iniciar viaje, Cancelar)
  async function handleStatusChange(orderId, status) {
    if (status === 'CANCELLED' && !window.confirm(`¿Seguro de cancelar el Pedido #${orderId}?`)) {
      return
    }
    try {
      setActionLoadingId(orderId)
      await changeOrderStatus(orderId, status, token)
      showSuccess(`Pedido #${orderId} actualizado a ${STATUS_LABELS[status] || status}`)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Confirmar entrega física con bidones devueltos
  async function handleConfirmDelivered() {
    if (!deliveredModal.order) return
    try {
      setActionLoadingId(deliveredModal.order.id)
      await changeOrderStatus(deliveredModal.order.id, 'DELIVERED', token)
      setDeliveredModal({ open: false, order: null, returnedContainers: 0, notes: '' })
      showSuccess(`¡Pedido #${deliveredModal.order.id} entregado y cobrado!`)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoadingId(null)
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
    { value: 'ALL', label: '📋 Todos', count: stats.total },
    { value: 'AVAILABLE', label: '✋ Disponibles', count: stats.available },
    { value: 'MY_TRIP', label: '🚀 En mi viaje', count: stats.myTrip },
    { value: 'DELIVERED', label: '✅ Entregados', count: stats.delivered },
  ]

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      {/* Header Mobile */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              HOJA DE RUTA GENERAL
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
            🔄 {loading ? 'Cargando…' : 'Refrescar'}
          </button>
        </div>

        {/* Barra de Progreso del Día */}
        <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginTop: '0.85rem', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <span className="muted">Progreso de entregas completadas:</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {stats.delivered} de {stats.total} ({stats.progressPercent}%)
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

      {/* Alertas */}
      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
          <span>⚠️ {error}</span>
        </div>
      )}
      {successMsg && (
        <div className="alert alert--success" style={{ marginBottom: '1rem' }}>
          <span>✅ {successMsg}</span>
        </div>
      )}

      {/* Selector de Pestañas en Píldora */}
      <div className="tabs" style={{ marginBottom: '1.15rem' }}>
        {tabs.map((t) => (
          <button
            key={t.value}
            className={`tabs__btn ${filter === t.value ? 'tabs__btn--active' : ''}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label} {t.count > 0 && <span style={{ opacity: 0.85, marginLeft: '3px' }}>({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Estados de Carga y Vacío */}
      {loading && orders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p className="muted" style={{ margin: 0 }}>Cargando pedidos de la base de datos…</p>
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.25rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 style={{ margin: 0 }}>Sin pedidos en esta sección</h3>
          <p className="muted" style={{ margin: '0.35rem 0 1.25rem' }}>
            No hay entregas que coincidan con el filtro seleccionado.
          </p>
          {filter !== 'ALL' && (
            <button className="btn btn-outline btn-sm" onClick={() => setFilter('ALL')}>
              Ver todos los pedidos
            </button>
          )}
        </div>
      )}

      {/* Lista de Tarjetas de Pedidos Operativas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
        {filteredOrders.map((o) => {
          const isOut = o.status === 'OUT_FOR_DELIVERY'
          const isDelivered = o.status === 'DELIVERED'
          const isCancelled = o.status === 'CANCELLED'
          const isPending = o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING'

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
                  : isCancelled
                  ? '6px solid var(--danger)'
                  : '6px solid var(--warning)',
                background: isOut ? '#fdfefe' : '#ffffff',
                boxShadow: isOut ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              }}
            >
              {/* Header de la tarjeta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    PEDIDO #{o.id}
                  </span>
                  <h2 style={{ fontSize: '1.2rem', margin: '0.1rem 0 0', color: 'var(--text)' }}>
                    {o.customer_name || 'Cliente'}
                  </h2>
                </div>
                <span className={`badge badge--${o.status}`}>
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>

              {/* Bloque de Destino */}
              <div style={{ background: 'var(--bg)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
                  📍 {o.street || 'Dirección sin especificar'}
                </p>
                {o.city && (
                  <p className="muted" style={{ margin: '0.15rem 0 0', fontSize: '0.82rem' }}>
                    {o.city}
                  </p>
                )}
                {o.notes && (
                  <div style={{ marginTop: '0.4rem', padding: '0.3rem 0.55rem', background: '#fff', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--primary-dark)' }}>
                    📝 <strong>Nota:</strong> {o.notes}
                  </div>
                )}
              </div>

              {/* Botones de Navegación GPS y WhatsApp (Thumb Zone) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <a
                  href={getMapsUrl(o)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 700, borderColor: '#93c5fd' }}
                >
                  🗺️ Google Maps
                </a>

                {o.customer_phone ? (
                  <a
                    href={getWhatsAppUrl(o)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ minHeight: '44px', fontSize: '0.85rem', fontWeight: 700, borderColor: '#86efac', color: '#15803d' }}
                  >
                    💬 WhatsApp
                  </a>
                ) : (
                  <button className="btn btn-outline" disabled style={{ minHeight: '44px', fontSize: '0.85rem' }}>
                    💬 Sin teléfono
                  </button>
                )}
              </div>

              {/* Items / Carga a Entregar */}
              {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                <div style={{ marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
                    Carga a entregar:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {o.items.map((it, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-dark)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.55rem',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
                <span className="muted" style={{ fontSize: '0.86rem' }}>
                  Cobro: <strong style={{ color: 'var(--text)' }}>{o.payment_method === 'CASH' ? '💵 Efectivo' : '💳 Transferencia'}</strong>
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtMoney(o.total)}
                </span>
              </div>

              {/* ========================================================
                  BOTONES DE ACCIÓN OPERATIVA DEL REPARTIDOR
                  ======================================================== */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Si está pendiente: Botón para TOMAR EL PEDIDO */}
                {isPending && (
                  <button
                    className="btn btn-primary btn-block btn-touch-large"
                    disabled={actionLoadingId === o.id}
                    onClick={() => handleTakeOrder(o.id)}
                  >
                    ✋ Tomar Pedido y Salir a Reparto
                  </button>
                )}

                {/* Si está en viaje: Botón para CONFIRMAR ENTREGA */}
                {isOut && (
                  <button
                    className="btn btn-success btn-block btn-touch-large"
                    disabled={actionLoadingId === o.id}
                    onClick={() =>
                      setDeliveredModal({
                        open: true,
                        order: o,
                        returnedContainers: o.containers_delivered || 1,
                        notes: '',
                      })
                    }
                  >
                    ✅ Confirmar Entrega y Cobro
                  </button>
                )}

                {/* Botón de Cancelar para pedidos activos */}
                {!isDelivered && !isCancelled && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)', fontSize: '0.8rem' }}
                    disabled={actionLoadingId === o.id}
                    onClick={() => handleStatusChange(o.id, 'CANCELLED')}
                  >
                    ❌ Cancelar pedido
                  </button>
                )}

                {/* Estado Final */}
                {isDelivered && (
                  <div style={{ width: '100%', textAlign: 'center', padding: '0.65rem', background: '#dcfce7', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem' }}>
                    ✔️ Entregado y cobrado
                  </div>
                )}
                {isCancelled && (
                  <div style={{ width: '100%', textAlign: 'center', padding: '0.65rem', background: '#fee2e2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem' }}>
                    ✖️ Pedido cancelado
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Bottom Sheet: Confirmar Entrega y Envases */}
      {deliveredModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 520, width: '100%', padding: '1.5rem', background: '#ffffff', borderRadius: '24px 24px 0 0', margin: 0, boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.25s ease-out' }}>
            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 1.25rem' }} />

            <h2 style={{ fontSize: '1.35rem', marginTop: 0, marginBottom: '0.25rem' }}>
              Confirmar Entrega #{deliveredModal.order?.id}
            </h2>
            <p className="muted" style={{ margin: '0 0 1rem', fontSize: '0.9rem' }}>
              Cliente: <strong>{deliveredModal.order?.customer_name}</strong>
            </p>

            <div style={{ margin: '0.75rem 0 1.25rem', padding: '0.85rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="muted">Total cobrado:</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                  {fmtMoney(deliveredModal.order?.total)}
                </strong>
              </div>
              <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.82rem' }}>
                Método: {deliveredModal.order?.payment_method === 'CASH' ? '💵 Efectivo' : '💳 Transferencia / Tarjeta'}
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
                Volver
              </button>
              <button
                type="button"
                className="btn btn-success"
                style={{ minHeight: '48px', fontWeight: 800 }}
                disabled={actionLoadingId === deliveredModal.order?.id}
                onClick={handleConfirmDelivered}
              >
                {actionLoadingId === deliveredModal.order?.id ? 'Guardando…' : 'Confirmar Entrega'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
