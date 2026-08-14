import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getAddresses, createAddress, getZones } from '../services/addresses.js'
import { previewOrder, createOrder } from '../services/orders.js'

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
  const [newAddress, setNewAddress] = useState({ label: 'Casa', street: '', city: '', deliveryZoneId: '' })
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
          city: newAddress.city || 'Ciudad',
          deliveryZoneId: newAddress.deliveryZoneId ? Number(newAddress.deliveryZoneId) : zones[0]?.id || 1,
        },
        token
      )
      setAddresses((prev) => [...prev, address])
      setAddressId(Number(address.id))
      setShowNewAddress(false)
      setNewAddress({ label: 'Casa', street: '', city: '', deliveryZoneId: zones[0]?.id || '' })
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
      setError('Por favor seleccioná o agregá una dirección de entrega.')
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

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="page" style={{ maxWidth: 540, textAlign: 'center', padding: '3rem 1.25rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛒</div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Tu carrito está vacío</h1>
        <p className="muted" style={{ margin: '0.5rem 0 1.5rem' }}>
          Agregá bidones o dispensadores desde el catálogo para iniciar tu pedido.
        </p>
        <Link className="btn btn-primary btn-touch-large" to="/productos">
          💧 Ir al Catálogo de Productos
        </Link>
      </div>
    )
  }

  // Si el usuario no ha iniciado sesión, mostrar banner de autenticación
  if (!user || !token) {
    return (
      <div className="page" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
          <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Ingresá para Confirmar</h1>
          <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
            Para coordinar tu dirección y asignarte un repartidor, accedé a tu cuenta.
          </p>
        </div>

        {error && (
          <div className="alert alert--error" style={{ marginBottom: '1.25rem' }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="card" style={{ padding: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 0.85rem' }}>
            Acceso Rápido con 1 Clic
          </p>

          <div style={{ display: 'grid', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              disabled={loginLoading}
              style={{ minHeight: '46px', justifyContent: 'space-between', background: '#f8fafc' }}
              onClick={() => handleQuickLogin('juan@cliente.com', '123456')}
            >
              <span>👤 <strong>Juan Cliente</strong></span>
              <span className="muted" style={{ fontSize: '0.78rem' }}>juan@cliente.com</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              disabled={loginLoading}
              style={{ minHeight: '46px', justifyContent: 'space-between', background: '#fffbeb', borderColor: '#fef08a' }}
              onClick={() => handleQuickLogin('admin@agua.com', '123456')}
            >
              <span>👑 <strong>Admin / Dev</strong></span>
              <span className="muted" style={{ fontSize: '0.78rem' }}>admin@agua.com</span>
            </button>
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link to="/login" className="btn btn-primary btn-block btn-touch-large">
              Ingresar con otra cuenta
            </Link>
          </div>
        </div>

        <p className="muted" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
          Tus productos guardados en el carrito se mantendrán intactos.
        </p>
      </div>
    )
  }

  const addr = selectedAddress()
  const fee = preview?.deliveryFee ?? (addr ? Number(addr.zone_price || 1000) : 1000)
  const finalTotal = preview ? preview.total : subtotal + fee

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      {/* Header del Checkout */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          PASO FINAL
        </span>
        <h1 style={{ fontSize: '1.65rem', margin: '0.1rem 0 0' }}>Confirmar tu Pedido</h1>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Resumen de Productos */}
      <section className="card" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📦 Productos a recibir</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
            {totalBottlesInOrder} {totalBottlesInOrder === 1 ? 'unidad' : 'unidades'}
          </span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {items.map((item) => (
            <div
              key={item.productId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text)' }}>
                  {item.quantity}x {item.name}
                </strong>
                <div className="muted" style={{ fontSize: '0.8rem' }}>
                  {formatPrice(item.price)} c/u
                </div>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Control Automático de Envases y Retiro */}
      <section className="card" style={{ padding: '1.25rem', background: '#f8fafc', border: '1px solid #bae6fd' }}>
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>🔄</span> Envases y Retiro de Vacíos
        </h2>

        <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem' }}>
            <span>🚚 Bidones llenos a entregar:</span>
            <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{containersDelivered}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            <span>🔁 Envases vacíos a retirar:</span>
            <strong style={{ color: containersReturned > 0 ? 'var(--success)' : 'var(--muted)', fontSize: '1.05rem' }}>
              {containersReturned}
            </strong>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={isFirstPurchase}
            onChange={(e) => {
              setIsFirstPurchase(e.target.checked)
              if (e.target.checked) setCustomReturned(0)
            }}
            style={{ width: '18px', height: '18px' }}
          />
          <span>Es mi primera compra (no tengo envases vacíos para devolver)</span>
        </label>
      </section>

      {/* Dirección de Entrega */}
      <section className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>📍 Dirección de Entrega</h2>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ minHeight: '34px', fontSize: '0.78rem' }}
            onClick={() => setShowNewAddress((v) => !v)}
          >
            {showNewAddress ? 'Ver guardadas' : '➕ Nueva'}
          </button>
        </div>

        {!showNewAddress && addresses.length > 0 && (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {addresses.map((a) => (
              <label
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  border: Number(a.id) === Number(addressId) ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: Number(a.id) === Number(addressId) ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="address"
                  checked={Number(a.id) === Number(addressId)}
                  onChange={() => setAddressId(Number(a.id))}
                  style={{ width: '18px', height: '18px' }}
                />
                <div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{a.street}</strong>
                  <div className="muted" style={{ fontSize: '0.8rem' }}>
                    {a.city} {a.zone_name ? `· Zona: ${a.zone_name}` : ''}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}

        {(showNewAddress || addresses.length === 0) && (
          <form onSubmit={handleNewAddress} className="form" style={{ marginTop: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label">Calle y Número:</label>
              <input
                className="input"
                placeholder="ej: Av. Libertador 2450"
                required
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad / Localidad:</label>
              <input
                className="input"
                placeholder="ej: Buenos Aires"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Zona de Reparto:</label>
              <select
                className="select"
                value={newAddress.deliveryZoneId}
                onChange={(e) => setNewAddress({ ...newAddress, deliveryZoneId: e.target.value })}
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({formatPrice(z.price)})
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary btn-sm" type="submit" style={{ minHeight: '40px' }}>
              Guardar y Usar Esta Dirección
            </button>
          </form>
        )}
      </section>

      {/* Método de Pago */}
      <section className="card" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem' }}>💵 Método de Pago</h2>
        <select
          className="select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="CASH">💵 Efectivo al recibir en mano</option>
          <option value="TRANSFER">📲 Transferencia Bancaria / QR</option>
          <option value="CARD">💳 Tarjeta de Débito / Crédito</option>
        </select>
      </section>

      {/* Total y Resumen Financiero */}
      <div className="card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.92rem' }}>
          <span className="muted">Subtotal productos:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
          <span className="muted">Costo de entrega a domicilio:</span>
          <span>{formatPrice(fee)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: '0.75rem',
            borderTop: '2px solid var(--border)',
          }}
        >
          <strong style={{ fontSize: '1.15rem' }}>Total a pagar:</strong>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      {/* Botón de Confirmación Principal */}
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <button
          className="btn btn-success btn-block btn-touch-large"
          type="submit"
          disabled={submitting || (!addressId && !showNewAddress)}
          style={{ fontSize: '1.05rem', fontWeight: 800 }}
        >
          {submitting ? 'Registrando en base de datos…' : '🚀 Confirmar y Enviar Pedido'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/productos" className="muted" style={{ fontSize: '0.88rem' }}>
          ← Seguir comprando en el catálogo
        </Link>
      </div>
    </div>
  )
}
