import { useEffect, useState } from 'react'
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
  }).format(value)
}

export default function Checkout() {
  const { token } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [zones, setZones] = useState([])
  const [addressId, setAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [containersDelivered, setContainersDelivered] = useState(0)
  const [containersReturned, setContainersReturned] = useState(0)
  const [promotionCode, setPromotionCode] = useState('')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', deliveryZoneId: '' })

  useEffect(() => {
    getAddresses(token).then(setAddresses).catch((e) => setError(e.message))
    getZones(token).then(setZones).catch((e) => setError(e.message))
  }, [token])

  useEffect(() => {
    if (addresses.length > 0 && addressId === null) {
      setAddressId(Number(addresses[0].id))
    }
  }, [addresses, addressId])

  useEffect(() => {
    if (!addressId || items.length === 0) return
    previewOrder(
      {
        addressId,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        promotionCode: promotionCode || undefined,
      },
      token
    )
      .then(setPreview)
      .catch((e) => setError(e.message))
  }, [addressId, items, promotionCode, token])

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
          city: newAddress.city,
          deliveryZoneId: newAddress.deliveryZoneId ? Number(newAddress.deliveryZoneId) : null,
        },
        token
      )
      setAddresses((prev) => [...prev, address])
      setAddressId(Number(address.id))
      setShowNewAddress(false)
      setNewAddress({ label: '', street: '', city: '', deliveryZoneId: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const order = await createOrder(
        {
          addressId,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          paymentMethod,
          containersDelivered,
          containersReturned,
          promotionCode: promotionCode || undefined,
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

  const addr = selectedAddress()
  const fee = preview?.deliveryFee ?? (addr ? Number(addr.zone_price) : 0)

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Confirmar pedido</h1>
      {error && <p className="alert alert--error">{error}</p>}

      <section className="card">
        <h2 className="card__title">Productos</h2>
        {items.map((item) => (
          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '0.4rem 0' }}>
            <span>
              {item.quantity} x {item.name}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="card__title">Dirección de entrega</h2>
        {addresses.length === 0 && !showNewAddress && <p className="muted">No tenés direcciones cargadas.</p>}
        <div className="grid">
          {addresses.map((a) => (
            <label key={a.id} className="card card--flat" style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <input
                type="radio"
                name="address"
                checked={Number(a.id) === Number(addressId)}
                onChange={() => setAddressId(Number(a.id))}
              />
              <span>
                <strong>{a.label}</strong> — {a.street}, {a.city} <span className="muted">({a.zone_name}: {formatPrice(a.zone_price)})</span>
              </span>
            </label>
          ))}
        </div>
        <button className="btn btn-outline btn-sm mt-1" onClick={() => setShowNewAddress((v) => !v)}>
          {showNewAddress ? 'Cancelar' : 'Agregar dirección'}
        </button>
        {showNewAddress && (
          <form onSubmit={handleNewAddress} className="form mt-1">
            <input className="input" placeholder="Etiqueta (Casa, Trabajo)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
            <input className="input" placeholder="Calle y número *" required value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
            <input className="input" placeholder="Ciudad" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <select className="select" value={newAddress.deliveryZoneId} onChange={(e) => setNewAddress({ ...newAddress, deliveryZoneId: e.target.value })}>
              <option value="">Zona (seleccionar)</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — {formatPrice(z.price)}
                </option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" type="submit">Guardar dirección</button>
          </form>
        )}
      </section>

      <section className="card">
        <h2 className="card__title">Bidones</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="form-group">
            <label className="form-label">Bidones a entregar</label>
            <input
              className="input"
              type="number"
              min="0"
              value={containersDelivered}
              onChange={(e) => setContainersDelivered(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bidones a retirar</label>
            <input
              className="input"
              type="number"
              min="0"
              value={containersReturned}
              onChange={(e) => setContainersReturned(Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Pago</h2>
        <select className="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="CASH">Efectivo</option>
          <option value="CARD">Tarjeta</option>
          <option value="TRANSFER">Transferencia</option>
        </select>
      </section>

      <section className="card">
        <h2 className="card__title">Promoción</h2>
        <div className="form-inline">
          <input className="input" style={{ flex: 1, minWidth: 180 }} placeholder="Código (ej: AGUA2026)" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
          {preview?.promotion && <span className="badge badge--success">{preview.promotion.name}</span>}
        </div>
      </section>

      <div className="card">
        <p>Subtotal: {formatPrice(subtotal)}</p>
        <p>Envío: {formatPrice(fee)}</p>
        {preview && Number(preview.discount) > 0 && (
          <p className="text-success">Descuento: -{formatPrice(preview.discount)}</p>
        )}
        <p style={{ fontWeight: 700 }}>Total: {formatPrice(preview ? preview.total : subtotal + fee)}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting || !addressId}>
          {submitting ? 'Creando pedido…' : 'Confirmar pedido'}
        </button>
      </form>
      <p className="muted mt-1">
        <Link to="/carrito">Volver al carrito</Link>
      </p>
    </div>
  )
}
