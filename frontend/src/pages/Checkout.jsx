import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getAddresses, createAddress, getZones } from '../services/addresses.js'
import { previewOrder, createOrder } from '../services/orders.js'
import {
  PackageIcon,
  RefreshCwIcon,
  TruckIcon,
  MapPinIcon,
  DollarSignIcon,
  CheckIcon,
  UserIcon,
  ShieldIcon,
  PlusIcon,
  ShoppingBagIcon,
  AlertCircleIcon,
  LockIcon,
  ChevronRightIcon,
  ClockIcon,
} from '../components/Icons.jsx'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default function Checkout() {
  const { user, token, login } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [zones, setZones] = useState([])
  const [addressId, setAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [isFirstPurchase, setIsFirstPurchase] = useState(false)
  const [customReturned, setCustomReturned] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: 'Casa', street: '', city: 'San Rafael', deliveryZoneId: '' })
  const [loginLoading, setLoginLoading] = useState(false)

  // Cálculo automático de bidones según los items del carrito
  const totalBottlesInOrder = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.quantity || 1), 0)
  }, [items])

  const containersDelivered = totalBottlesInOrder
  const containersReturned = isFirstPurchase
    ? 0
    : customReturned !== null
    ? customReturned
    : totalBottlesInOrder

  // Cargar direcciones y zonas cuando hay token
  useEffect(() => {
    if (!token) return
    setError(null)
    getAddresses(token)
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setAddresses(list)
        if (list.length > 0) {
          setAddressId(Number(list[0].id))
        } else {
          setShowNewAddress(true)
        }
      })
      .catch((e) => setError(e.message))

    getZones(token)
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setZones(list)
        if (list.length > 0 && !newAddress.deliveryZoneId) {
          setNewAddress((prev) => ({ ...prev, deliveryZoneId: list[0].id }))
        }
      })
      .catch((e) => setError(e.message))
  }, [token])

  // Previsualizar costo de envío
  useEffect(() => {
    if (!token || !addressId || items.length === 0) return
    previewOrder(
      {
        addressId,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      },
      token
    )
      .then(setPreview)
      .catch(() => {
        // En caso de fallo de preview, no bloqueamos la UI
      })
  }, [addressId, items, token])

  function selectedAddress() {
    return addresses.find((a) => Number(a.id) === Number(addressId))
  }

  async function handleNewAddress(e) {
    e.preventDefault()
    try {
      const address = await createAddress(
        {
          label: newAddress.label || 'Casa',
          street: newAddress.street,
          city: newAddress.city || 'San Rafael',
          deliveryZoneId: newAddress.deliveryZoneId ? Number(newAddress.deliveryZoneId) : zones[0]?.id || 1,
        },
        token
      )
      setAddresses((prev) => [...prev, address])
      setAddressId(Number(address.id))
      setShowNewAddress(false)
      setNewAddress({ label: 'Casa', street: '', city: 'San Rafael', deliveryZoneId: zones[0]?.id || '' })
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleQuickLogin(email, pass) {
    setLoginLoading(true)
    setError(null)
    try {
      await login(email, pass)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!token) {
      setError('Debes iniciar sesión para confirmar tu pedido.')
      return
    }
    if (!addressId) {
      setError('Por favor seleccioná o agregá una dirección de entrega en San Rafael.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const order = await createOrder(
        {
          addressId: Number(addressId),
          items: items.map((i) => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
          paymentMethod,
          containersDelivered,
          containersReturned,
        },
        token
      )
      clearCart()
      navigate(`/pedidos/${order.id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="page" style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', padding: '3.5rem 1.25rem' }}>
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
          <ShoppingBagIcon size={38} />
        </div>
        <h1 style={{ fontSize: '1.6rem', margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--text)' }}>
          Tu carrito está vacío
        </h1>
        <p className="muted" style={{ margin: '0 auto 2rem', fontSize: '0.94rem', lineHeight: 1.6, maxWidth: 380 }}>
          Elegí bidones retornables o dispensadores de agua purificada desde el catálogo oficial para coordinar tu entrega hoy.
        </p>
        <Link
          className="btn btn-primary"
          to="/productos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontWeight: 800,
            padding: '1rem 2rem',
            borderRadius: '9999px',
            boxShadow: '0 10px 24px rgba(11, 125, 194, 0.28)',
          }}
        >
          <ShoppingBagIcon size={18} />
          <span>Explorar Catálogo</span>
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    )
  }

  // Usuario no autenticado
  if (!user || !token) {
    return (
      <div className="page" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '9999px',
              background: 'var(--primary-light)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <LockIcon size={32} />
          </div>
          <h1 style={{ fontSize: '1.65rem', margin: 0, fontWeight: 800, color: 'var(--text)' }}>
            Confirmá tu Pedido
          </h1>
          <p className="muted" style={{ margin: '0.4rem 0 0', fontSize: '0.92rem' }}>
            Accedé para autocompletar tu dirección y asignar tu chofer en San Rafael.
          </p>
        </div>

        {error && (
          <div className="alert alert--error" style={{ marginBottom: '1.25rem', borderRadius: '18px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircleIcon size={18} />
              <span>{error}</span>
            </span>
          </div>
        )}

        <div
          className="card"
          style={{
            padding: '1.75rem',
            borderRadius: '28px',
            border: '1px solid rgba(11, 125, 194, 0.12)',
            boxShadow: 'var(--shadow-soft)',
            background: '#ffffff',
          }}
        >
          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'center',
              margin: '0 0 1rem',
            }}
          >
            Acceso Rápido con 1 Clic
          </p>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              disabled={loginLoading}
              style={{
                minHeight: '52px',
                justifyContent: 'space-between',
                background: '#f8fafc',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1.1rem',
              }}
              onClick={() => handleQuickLogin('juan@cliente.com', '123456')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
                  }}
                >
                  <UserIcon size={16} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)' }}>Juan Cliente</div>
                  <div className="muted" style={{ fontSize: '0.76rem' }}>juan@cliente.com</div>
                </div>
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
                Entrar
              </span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              disabled={loginLoading}
              style={{
                minHeight: '52px',
                justifyContent: 'space-between',
                background: '#fffdf5',
                borderColor: '#fde68a',
                borderRadius: '18px',
                padding: '0.75rem 1.1rem',
              }}
              onClick={() => handleQuickLogin('admin@agua.com', '123456')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#92400e',
                  }}
                >
                  <ShieldIcon size={16} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#92400e' }}>Admin / Dueño</div>
                  <div className="muted" style={{ fontSize: '0.76rem' }}>admin@agua.com</div>
                </div>
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', background: '#fef3c7', padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
                Admin
              </span>
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link
              to="/login"
              className="btn btn-primary btn-block"
              style={{
                borderRadius: '9999px',
                padding: '0.85rem 1.25rem',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(11, 125, 194, 0.22)',
              }}
            >
              Ingresar con otra cuenta
            </Link>
          </div>
        </div>

        <p className="muted" style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
          Tus productos guardados en el carrito se conservarán automáticamente.
        </p>
      </div>
    )
  }

  const addr = selectedAddress()
  const fee = preview?.deliveryFee ?? (addr ? Number(addr.zone_price || 1000) : 1000)
  const finalTotal = preview ? preview.total : subtotal + fee

  return (
    <div className="page" style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: '7rem' }}>
      {/* Header del Checkout */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--primary)',
              background: 'var(--primary-light)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Paso Final
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ClockIcon size={14} /> Entrega en el día
          </span>
        </div>
        <h1 style={{ fontSize: '1.8rem', margin: '0.2rem 0 0', fontWeight: 900, color: 'var(--text)' }}>
          Confirmar Pedido
        </h1>
        <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Entrega en el día en San Rafael.
        </p>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem', borderRadius: '20px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </span>
        </div>
      )}

      <div className="checkout-desktop-layout">
        <div>
          {/* Resumen de Productos */}
          <section
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '28px',
          border: '1px solid rgba(11, 125, 194, 0.12)',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <PackageIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: 'var(--text)' }}>
                Tu Pedido
              </h2>
              <span className="muted" style={{ fontSize: '0.78rem' }}>Unidades</span>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--primary)',
              fontWeight: 800,
              background: 'var(--primary-light)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
            }}
          >
            {totalBottlesInOrder} {totalBottlesInOrder === 1 ? 'unidad' : 'unidades'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map((item) => (
            <div
              key={item.productId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '18px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                  }}
                >
                  {item.quantity}
                </span>
                <div>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--text)', display: 'block' }}>
                    {item.name}
                  </strong>
                  <span className="muted" style={{ fontSize: '0.78rem' }}>
                    {formatPrice(item.price)} por unidad
                  </span>
                </div>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', fontSize: '1rem' }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Control Automático de Envases y Retiro */}
      <section
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '28px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          boxShadow: 'var(--shadow-soft)',
          background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
            }}
          >
            <RefreshCwIcon size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#065f46' }}>
              Recambio de Envases
            </h2>
            <span className="muted" style={{ fontSize: '0.78rem' }}>Entregás vacíos y recibís llenos</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              background: '#ffffff',
              padding: '1rem',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
              <TruckIcon size={16} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Te Entregamos</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>
              {containersDelivered}
            </div>
            <span className="muted" style={{ fontSize: '0.74rem' }}>Llenos</span>
          </div>

          <div
            style={{
              background: '#ffffff',
              padding: '1rem',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--success)', marginBottom: '0.25rem' }}>
              <RefreshCwIcon size={16} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Nos Llevamos</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: containersReturned > 0 ? 'var(--success)' : 'var(--muted)' }}>
              {containersReturned}
            </div>
            <span className="muted" style={{ fontSize: '0.74rem' }}>Vacíos</span>
          </div>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.75rem 1rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #cbd5e1',
          }}
        >
          <input
            type="checkbox"
            checked={isFirstPurchase}
            onChange={(e) => {
              setIsFirstPurchase(e.target.checked)
              if (e.target.checked) setCustomReturned(0)
            }}
            style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>
            Primera compra (no tengo envases para devolver)
          </span>
        </label>
      </section>

      {/* Dirección de Entrega */}
      <section
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '28px',
          border: '1px solid rgba(11, 125, 194, 0.12)',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <MapPinIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: 'var(--text)' }}>
                Dirección de Entrega
              </h2>
              <span className="muted" style={{ fontSize: '0.78rem' }}>San Rafael</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{
              minHeight: '38px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 800,
              borderRadius: '9999px',
            }}
            onClick={() => setShowNewAddress((v) => !v)}
          >
            <PlusIcon size={14} />
            <span>{showNewAddress ? 'Mis guardadas' : 'Nueva'}</span>
          </button>
        </div>

        {!showNewAddress && addresses.length > 0 && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {addresses.map((a) => {
              const isSelected = Number(a.id) === Number(addressId)
              return (
                <label
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: '20px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    background: isSelected ? 'rgba(11, 125, 194, 0.05)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: isSelected ? '6px solid var(--primary)' : '2px solid #cbd5e1',
                        background: '#ffffff',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text)', display: 'block' }}>
                        {a.street}
                      </strong>
                      <span className="muted" style={{ fontSize: '0.8rem' }}>
                        {a.city || 'San Rafael'} {a.zone_name ? `· Zona: ${a.zone_name}` : ''}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        background: 'var(--primary-light)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Seleccionada
                    </span>
                  )}
                  <input
                    type="radio"
                    name="address"
                    checked={isSelected}
                    onChange={() => setAddressId(Number(a.id))}
                    style={{ display: 'none' }}
                  />
                </label>
              )
            })}
          </div>
        )}

        {(showNewAddress || addresses.length === 0) && (
          <form onSubmit={handleNewAddress} className="form" style={{ marginTop: '0.5rem' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                Calle y Altura:
              </label>
              <input
                className="input"
                placeholder="ej: Av. Balloffet 1250"
                required
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                Localidad:
              </label>
              <input
                className="input"
                placeholder="San Rafael"
                value={newAddress.city || 'San Rafael'}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                borderRadius: '9999px',
                fontWeight: 800,
              }}
            >
              Guardar y Usar Esta Dirección
            </button>
          </form>
        )}
      </section>

      {/* Forma de Pago */}
      <section
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '28px',
          border: '1px solid rgba(11, 125, 194, 0.12)',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <DollarSignIcon size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: 'var(--text)' }}>
              Método de Pago
            </h2>
            <span className="muted" style={{ fontSize: '0.78rem' }}>Al recibir el pedido</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { id: 'CASH', title: 'Efectivo en Mano', desc: 'En billetes al recibir' },
            { id: 'TRANSFER', title: 'Transferencia Bancaria / QR', desc: 'Con alias o QR al recibir' },
            { id: 'CARD', title: 'Tarjeta Débito / Crédito', desc: 'Con posnet al recibir' },
          ].map((m) => {
            const isSelected = paymentMethod === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: '20px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: isSelected ? 'rgba(11, 125, 194, 0.05)' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.96rem', color: 'var(--text)', display: 'block' }}>
                    {m.title}
                  </strong>
                  <span className="muted" style={{ fontSize: '0.78rem' }}>
                    {m.desc}
                  </span>
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: isSelected ? '6px solid var(--primary)' : '2px solid #cbd5e1',
                    background: '#ffffff',
                    flexShrink: 0,
                  }}
                />
              </button>
            )
          })}
        </div>
      </section>

      </div>
        <div className="checkout-sidebar">
          {/* Resumen de Total */}
          <div
            className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '28px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.94rem' }}>
          <span className="muted">Productos:</span>
          <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatPrice(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontSize: '0.94rem' }}>
          <span className="muted">Envío:</span>
          <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--primary)' }}>
            {formatPrice(fee)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: '0.85rem',
            borderTop: '2px dashed #cbd5e1',
          }}
        >
          <div>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text)', display: 'block' }}>Total:</strong>
            <span className="muted" style={{ fontSize: '0.76rem' }}>Abonás al recibir</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      {/* Botón de Confirmación Flotante / Sticky */}
      <div
        style={{
          position: 'sticky',
          bottom: '1rem',
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          padding: '0.75rem',
          borderRadius: '9999px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <button
            className="btn btn-success btn-block"
            type="submit"
            disabled={submitting || (!addressId && !showNewAddress)}
            style={{
              minHeight: '56px',
              borderRadius: '9999px',
              fontSize: '1.05rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            <CheckIcon size={22} />
            <span>{submitting ? 'Confirmando pedido...' : `Confirmar Pedido · ${formatPrice(finalTotal)}`}</span>
          </button>
        </form>
      </div>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link to="/productos" className="muted" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              ← Seguir viendo productos en el catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
