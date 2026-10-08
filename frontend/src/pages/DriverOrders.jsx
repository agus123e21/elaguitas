import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyOrders, changeOrderStatus, takeOrder } from '../services/orders.js'
import {
  TruckIcon,
  RefreshCwIcon,
  MapPinIcon,
  WhatsAppIcon,
  CheckIcon,
  DropletIcon,
  PhoneIcon,
  PackageIcon,
  ClockIcon,
  AlertCircleIcon,
  DollarSignIcon,
  SlidersIcon,
} from '../components/Icons.jsx'

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'En Reparto',
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
      showSuccess(`Tomaste el Pedido #${orderId}. Ya está asignado a tu hoja de ruta.`)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Cambiar estado (Iniciar viaje, Cancelar)
  async function handleStatusChange(orderId, status) {
    if (status === 'CANCELLED' && !window.confirm(`¿Seguro que deseas cancelar el Pedido #${orderId}?`)) {
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

  // Confirmar Entrega
  async function handleConfirmDelivered() {
    if (!deliveredModal.order) return
    try {
      setActionLoadingId(deliveredModal.order.id)
      await changeOrderStatus(deliveredModal.order.id, 'DELIVERED', token)
      setDeliveredModal({ open: false, order: null, returnedContainers: 0, notes: '' })
      showSuccess(`Pedido #${deliveredModal.order.id} entregado y registrado exitosamente.`)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  function getMapsUrl(order) {
    const fullAddress = `${order.street || ''}, ${order.city || 'San Rafael'}`.trim()
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
  }

  function getWhatsAppUrl(order) {
    const cleanPhone = (order.customer_phone || '').replace(/\D/g, '')
    const message = `Hola ${order.customer_name || 'Cliente'}, te escribe ${user?.name || 'tu repartidor'} de El Agüitas. Estoy en viaje hacia tu dirección (${order.street}) con tu pedido #${order.id}.`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }

  const tabs = [
    { value: 'ALL', label: 'Todos', count: stats.total },
    { value: 'AVAILABLE', label: 'Disponibles', count: stats.available },
    { value: 'MY_TRIP', label: 'En Viaje', count: stats.myTrip },
    { value: 'DELIVERED', label: 'Entregados', count: stats.delivered },
  ]

  return (
    <div className="page" style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: '7rem' }}>
      {/* Header Operativo de Chofer */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  background: 'var(--primary-light)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Repartos del Día
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPinIcon size={13} /> San Rafael
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', margin: '0.1rem 0 0', fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TruckIcon size={26} color="var(--primary)" />
              <span>{user?.name || 'Repartidor'}</span>
            </h1>
          </div>

          <button
            className="btn btn-outline"
            onClick={load}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '9999px',
              minHeight: '42px',
              padding: '0.4rem 1.1rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              borderColor: '#e2e8f0',
              background: '#ffffff',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <RefreshCwIcon size={15} />
            <span>{loading ? 'Cargando…' : 'Refrescar'}</span>
          </button>
        </div>

        {/* Card de Progreso del Reparto */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.25rem 1.4rem',
            borderRadius: '24px',
            border: '1px solid rgba(11, 125, 194, 0.12)',
            marginTop: '1.15rem',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Entregas del turno:</span>
            <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.98rem' }}>
              {stats.delivered} de {stats.total} completadas ({stats.progressPercent}%)
            </span>
          </div>
          <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${stats.progressPercent}%`,
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem', borderRadius: '18px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </span>
        </div>
      )}
      {successMsg && (
        <div className="alert alert--success" style={{ marginBottom: '1.25rem', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckIcon size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs Píldoras con Scroll Horizontal Suave */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.25rem',
          scrollbarWidth: 'none',
        }}
      >
        {tabs.map((t) => {
          const isActive = filter === t.value
          return (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                background: isActive ? 'var(--primary)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--text)',
                boxShadow: isActive ? '0 6px 18px rgba(11, 125, 194, 0.28)' : 'var(--shadow-soft)',
              }}
            >
              <span>{t.label}</span>
              {t.count > 0 && (
                <span
                  style={{
                    fontSize: '0.74rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary-light)',
                    color: isActive ? '#ffffff' : 'var(--primary)',
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Estado Vacío */}
      {!loading && filteredOrders.length === 0 && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            borderRadius: '28px',
            border: '1px solid rgba(11, 125, 194, 0.12)',
            boxShadow: 'var(--shadow-soft)',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '9999px',
              background: 'var(--primary-light)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              margin: '0 auto 1rem',
            }}
          >
            <PackageIcon size={32} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
            Sin pedidos en esta pestaña
          </h3>
          <p className="muted" style={{ margin: '0.4rem auto 1.5rem', fontSize: '0.9rem', maxWidth: 340 }}>
            No hay entregas pendientes registradas bajo el filtro actual.
          </p>
          {filter !== 'ALL' && (
            <button
              className="btn btn-outline"
              onClick={() => setFilter('ALL')}
              style={{ borderRadius: '9999px', padding: '0.6rem 1.4rem', fontWeight: 800 }}
            >
              Ver todos los pedidos
            </button>
          )}
        </div>
      )}

      {/* Lista de Tarjetas de Pedidos Operativas */}
      <div className="orders-grid-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {filteredOrders.map((o) => {
          const isOut = o.status === 'OUT_FOR_DELIVERY'
          const isDelivered = o.status === 'DELIVERED'
          const isCancelled = o.status === 'CANCELLED'
          const isPending = o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING'

          return (
            <div
              key={o.id}
              className="card"
              style={{
                padding: '1.5rem',
                borderRadius: '28px',
                background: '#ffffff',
                border: isOut
                  ? '2px solid var(--primary)'
                  : isDelivered
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(11, 125, 194, 0.12)',
                boxShadow: isOut ? '0 12px 30px rgba(11, 125, 194, 0.14)' : 'var(--shadow-soft)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Header de la tarjeta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.95rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>
                      PEDIDO #{o.id}
                    </span>
                    <span className="muted" style={{ fontSize: '0.74rem' }}>· San Rafael</span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 900, color: 'var(--text)' }}>
                    {o.customer_name || 'Cliente'}
                  </h2>
                </div>

                <span
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    background: isDelivered
                      ? '#ecfdf5'
                      : isOut
                      ? 'var(--primary-light)'
                      : isCancelled
                      ? '#fee2e2'
                      : '#fffbeb',
                    color: isDelivered
                      ? 'var(--success)'
                      : isOut
                      ? 'var(--primary)'
                      : isCancelled
                      ? 'var(--danger)'
                      : '#b45309',
                  }}
                >
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>

              {/* Bloque de Destino */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '20px',
                  border: '1px solid #f1f5f9',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <MapPinIcon size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
                      {o.street || 'Dirección sin especificar'}
                    </p>
                    <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.82rem' }}>
                      {o.city || 'San Rafael'} {o.zone_name ? `· Zona: ${o.zone_name}` : ''}
                    </p>
                  </div>
                </div>

                {o.notes && (
                  <div
                    style={{
                      marginTop: '0.65rem',
                      padding: '0.5rem 0.75rem',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.82rem',
                      color: 'var(--primary-dark)',
                    }}
                  >
                    <strong>Nota:</strong> {o.notes}
                  </div>
                )}
              </div>

              {/* Botones de Navegación GPS y WhatsApp (Touch Target 48px) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1rem' }}>
                <a
                  href={getMapsUrl(o)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{
                    minHeight: '48px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    borderColor: 'rgba(11, 125, 194, 0.25)',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#ffffff',
                    color: 'var(--primary)',
                  }}
                >
                  <MapPinIcon size={17} />
                  <span>Google Maps</span>
                </a>

                {o.customer_phone ? (
                  <a
                    href={getWhatsAppUrl(o)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{
                      minHeight: '48px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      borderColor: 'rgba(16, 185, 129, 0.35)',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#f0fdf4',
                      color: '#047857',
                    }}
                  >
                    <WhatsAppIcon size={17} color="#047857" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <button
                    className="btn btn-outline"
                    disabled
                    style={{
                      minHeight: '48px',
                      fontSize: '0.85rem',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <PhoneIcon size={16} color="var(--muted)" />
                    <span>Sin Teléfono</span>
                  </button>
                )}
              </div>

              {/* Items / Carga a Entregar */}
              {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                <div style={{ marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
                    Carga del pedido:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {o.items.map((it, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-dark)',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <DropletIcon size={14} color="var(--primary)" />
                        <span>{it.quantity}x {it.productName || it.product_name || 'Bidón'}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Total y Método de Pago */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="muted" style={{ fontSize: '0.88rem' }}>
                  Cobro:{' '}
                  <strong style={{ color: 'var(--text)' }}>
                    {o.payment_method === 'CASH' ? 'Efectivo en mano' : 'Transferencia QR'}
                  </strong>
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtMoney(o.total)}
                </span>
              </div>

              {/* Botones de Acción Operativa del Repartidor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {isPending && (
                  <button
                    className="btn btn-primary btn-block"
                    style={{
                      minHeight: '52px',
                      borderRadius: '9999px',
                      fontWeight: 900,
                      fontSize: '0.98rem',
                      boxShadow: '0 8px 20px rgba(11, 125, 194, 0.28)',
                    }}
                    disabled={actionLoadingId === o.id}
                    onClick={() => handleTakeOrder(o.id)}
                  >
                    Tomar Pedido
                  </button>
                )}

                {isOut && (
                  <button
                    className="btn btn-success btn-block"
                    style={{
                      minHeight: '52px',
                      borderRadius: '9999px',
                      fontWeight: 900,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.55rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                    }}
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
                    <CheckIcon size={20} />
                    <span>Confirmar Entrega</span>
                  </button>
                )}

                {!isDelivered && !isCancelled && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)', fontSize: '0.82rem', minHeight: '36px', borderRadius: '9999px' }}
                    disabled={actionLoadingId === o.id}
                    onClick={() => handleStatusChange(o.id, 'CANCELLED')}
                  >
                    Cancelar este pedido
                  </button>
                )}

                {isDelivered && (
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      padding: '0.85rem',
                      background: '#ecfdf5',
                      color: 'var(--success)',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <CheckIcon size={18} />
                    <span>Entregado y cobrado</span>
                  </div>
                )}
                {isCancelled && (
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      padding: '0.85rem',
                      background: '#fee2e2',
                      color: 'var(--danger)',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                    }}
                  >
                    Pedido cancelado
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Bottom Sheet: Confirmar Entrega y Envases Retornables */}
      {deliveredModal.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 540,
              width: '100%',
              padding: '1.75rem',
              background: '#ffffff',
              borderRadius: '36px 36px 0 0',
              margin: 0,
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div style={{ width: '48px', height: '5px', background: '#e2e8f0', borderRadius: '9999px', margin: '0 auto 1.5rem' }} />

            <h2 style={{ fontSize: '1.45rem', marginTop: 0, marginBottom: '0.35rem', fontWeight: 900, color: 'var(--text)' }}>
              Confirmar Entrega #{deliveredModal.order?.id}
            </h2>
            <p className="muted" style={{ margin: '0 0 1.25rem', fontSize: '0.92rem' }}>
              Cliente: <strong style={{ color: 'var(--text)' }}>{deliveredModal.order?.customer_name}</strong>
            </p>

            <div
              style={{
                margin: '0 0 1.25rem',
                padding: '1.1rem',
                background: '#f8fafc',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="muted" style={{ fontSize: '0.92rem' }}>Total a cobrar:</span>
                <strong style={{ fontSize: '1.35rem', color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtMoney(deliveredModal.order?.total)}
                </strong>
              </div>
              <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.84rem' }}>
                Modalidad: {deliveredModal.order?.payment_method === 'CASH' ? 'Efectivo en mano' : 'Transferencia / QR'}
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)' }}>
                Envases vacíos retirados en el domicilio:
              </label>
              <input
                className="input"
                type="number"
                min="0"
                value={deliveredModal.returnedContainers}
                onChange={(e) => setDeliveredModal({ ...deliveredModal, returnedContainers: Number(e.target.value) })}
                style={{ borderRadius: '16px', padding: '0.85rem 1rem', fontSize: '1.05rem', fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ minHeight: '50px', borderRadius: '9999px', fontWeight: 800 }}
                onClick={() => setDeliveredModal({ open: false, order: null, returnedContainers: 0, notes: '' })}
              >
                Volver
              </button>
              <button
                type="button"
                className="btn btn-success"
                style={{
                  minHeight: '50px',
                  borderRadius: '9999px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
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
