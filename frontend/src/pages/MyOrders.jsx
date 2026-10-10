import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyOrders, repeatOrder } from '../services/orders.js'
import {
  TruckIcon,
  PackageIcon,
  RefreshCwIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  AlertCircleIcon,
  CheckIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from '../components/Icons.jsx'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'En Preparación',
  OUT_FOR_DELIVERY: 'En Reparto',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

export default function MyOrders() {
  const { token, user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  function showSuccess(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  function load() {
    if (!token) return
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

  function handleRepeat(id) {
    repeatOrder(id, token)
      .then(() => {
        showSuccess(`Pedido #${id} repetido con éxito`)
        load()
      })
      .catch((e) => setError(e.message))
  }

  // Estado si el usuario no ha iniciado sesión
  if (!token) {
    return (
      <div className="page" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '3.5rem 1.25rem', paddingBottom: '7rem' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '9999px',
            background: 'var(--primary-light)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--primary)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <TruckIcon size={38} />
        </div>
        <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem', fontWeight: 900, color: 'var(--text)' }}>
          Mis Pedidos
        </h1>
        <p className="muted" style={{ margin: '0 auto 2rem', fontSize: '0.94rem', lineHeight: 1.6, maxWidth: 380 }}>
          Iniciá sesión para seguir el chofer en tiempo real por San Rafael, consultar el historial de entregas y repetir pedidos con 1 toque.
        </p>

        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 320, margin: '0 auto' }}>
          <Link
            className="btn btn-primary btn-block"
            to="/login"
            state={{ from: { pathname: '/pedidos' } }}
            style={{
              padding: '0.95rem 1.75rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.96rem',
              boxShadow: '0 8px 24px rgba(11, 125, 194, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <UserIcon size={18} />
            <span>Ingresar a mi Cuenta</span>
          </Link>

          <Link
            className="btn btn-outline btn-block"
            to="/productos"
            style={{
              padding: '0.85rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#ffffff',
            }}
          >
            <ShoppingBagIcon size={17} />
            <span>Ver Catálogo de Agua</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: '7rem' }}>
      {/* Header Mis Pedidos */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: 'var(--primary)',
                background: 'var(--primary-light)',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Historial y Estado
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', margin: '0.1rem 0 0', fontWeight: 900, color: 'var(--text)' }}>
            Mis Pedidos
          </h1>
        </div>

        <Link
          to="/productos"
          className="btn btn-primary"
          style={{
            borderRadius: '9999px',
            padding: '0.55rem 1.25rem',
            fontSize: '0.86rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <ShoppingBagIcon size={16} />
          <span>Nuevo Pedido</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem', borderRadius: '18px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert--success" style={{ marginBottom: '1.25rem', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <CheckIcon size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Estado Cargando */}
      {loading && orders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', borderRadius: '24px' }}>
          <p className="muted" style={{ margin: 0 }}>Consultando tus entregas en San Rafael…</p>
        </div>
      )}

      {/* Estado Vacío */}
      {!loading && orders.length === 0 && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            borderRadius: '32px',
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
              margin: '0 auto 1.25rem',
              color: 'var(--primary)',
            }}
          >
            <PackageIcon size={34} />
          </div>
          <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.4rem', fontWeight: 800, color: 'var(--text)' }}>
            Aún no hiciste pedidos
          </h2>
          <p className="muted" style={{ margin: '0 auto 1.75rem', fontSize: '0.92rem', maxWidth: 360, lineHeight: 1.5 }}>
            Elegí tus bidones retornables de 20L o 12L en San Rafael y recibilos hoy en tu puerta.
          </p>
          <Link
            className="btn btn-primary"
            to="/productos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.75rem',
              borderRadius: '9999px',
              fontWeight: 800,
            }}
          >
            <ShoppingBagIcon size={17} />
            <span>Ver Catálogo de Productos</span>
          </Link>
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="orders-grid-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.map((o) => {
          const isOut = o.status === 'OUT_FOR_DELIVERY'
          const isDelivered = o.status === 'DELIVERED'
          const isPending = o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING'

          return (
            <div
              key={o.id}
              className="card"
              style={{
                padding: '1.4rem',
                borderRadius: '26px',
                border: isOut
                  ? '2px solid var(--primary)'
                  : isDelivered
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(11, 125, 194, 0.12)',
                boxShadow: isOut ? '0 10px 28px rgba(11, 125, 194, 0.15)' : 'var(--shadow-soft)',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>
                      PEDIDO #{o.id}
                    </span>
                    <span className="muted" style={{ fontSize: '0.74rem' }}>
                      · {new Date(o.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--text)', display: 'block' }}>
                    {o.street || 'San Rafael'}
                  </strong>
                </div>

                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    background: isDelivered
                      ? '#ecfdf5'
                      : isOut
                      ? 'var(--primary-light)'
                      : '#fffbeb',
                    color: isDelivered
                      ? 'var(--success)'
                      : isOut
                      ? 'var(--primary)'
                      : '#b45309',
                  }}
                >
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>

              {/* Detalle de envases */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px',
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TruckIcon size={15} color="var(--primary)" />
                  <span>
                    {o.containers_delivered > 0 ? `${o.containers_delivered} bidones a entregar` : 'Entrega programada'}
                  </span>
                </div>
                <strong style={{ fontSize: '1.15rem', color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(o.total)}
                </strong>
              </div>

              {/* Botones de Acción */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <Link
                  className="btn btn-outline"
                  to={`/pedidos/${o.id}`}
                  style={{
                    minHeight: '44px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: '#ffffff',
                  }}
                >
                  <span>Ver Detalle</span>
                  <ChevronRightIcon size={14} />
                </Link>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleRepeat(o.id)}
                  style={{
                    minHeight: '44px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <RefreshCwIcon size={14} />
                  <span>Repetir Pedido</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
