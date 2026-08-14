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
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Confirmar pedido</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      {items.map((item) => (
        <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '0.4rem 0' }}>
          <span>
            {item.quantity} x {item.name}
          </span>
          <span>{formatPrice(item.price * item.quantity)}</span>
        </div>
      ))}

      <h2 style={{ fontSize: '1.1rem' }}>Dirección de entrega</h2>
      {addresses.length === 0 && !showNewAddress && (
        <p>No tenés direcciones cargadas.</p>
      )}
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {addresses.map((a) => (
          <label key={a.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: '0.5rem' }}>
            <input
              type="radio"
              name="address"
              checked={Number(a.id) === Number(addressId)}
              onChange={() => setAddressId(Number(a.id))}
            />
            <strong>{a.label}</strong> — {a.street}, {a.city} ({a.zone_name}: {formatPrice(a.zone_price)})
          </label>
        ))}
      </div>
      <button onClick={() => setShowNewAddress((v) => !v)}>
        {showNewAddress ? 'Cancelar' : 'Agregar dirección'}
      </button>
      {showNewAddress && (
        <form onSubmit={handleNewAddress} style={{ display: 'grid', gap: '0.4rem', marginTop: '0.5rem' }}>
          <input placeholder="Etiqueta (Casa, Trabajo)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
          <input placeholder="Calle y número *" required value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
          <input placeholder="Ciudad" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          <select value={newAddress.deliveryZoneId} onChange={(e) => setNewAddress({ ...newAddress, deliveryZoneId: e.target.value })}>
            <option value="">Zona (seleccionar)</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} — {formatPrice(z.price)}
              </option>
            ))}
          </select>
          <button type="submit">Guardar dirección</button>
        </form>
      )}

      <h2 style={{ fontSize: '1.1rem' }}>Bidones</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <label>
          Bidones a entregar
          <input
            type="number"
            min="0"
            value={containersDelivered}
            onChange={(e) => setContainersDelivered(Number(e.target.value))}
          />
        </label>
        <label>
          Bidones a retirar
          <input
            type="number"
            min="0"
            value={containersReturned}
            onChange={(e) => setContainersReturned(Number(e.target.value))}
          />
        </label>
      </div>

      <h2 style={{ fontSize: '1.1rem' }}>Pago</h2>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="CASH">Efectivo</option>
        <option value="CARD">Tarjeta</option>
        <option value="TRANSFER">Transferencia</option>
      </select>

      <h2 style={{ fontSize: '1.1rem' }}>Promoción</h2>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input placeholder="Código (ej: AGUA2026)" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
        {preview?.promotion && <span style={{ color: '#2e7d32' }}>{preview.promotion.name}</span>}
      </div>

      <div style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
        <p>Subtotal: {formatPrice(subtotal)}</p>
        <p>Envío: {formatPrice(fee)}</p>
        {preview && Number(preview.discount) > 0 && (
          <p>Descuento: -{formatPrice(preview.discount)}</p>
        )}
        <p style={{ fontWeight: 700 }}>Total: {formatPrice(preview ? preview.total : subtotal + fee)}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={submitting || !addressId}>
          {submitting ? 'Creando pedido…' : 'Confirmar pedido'}
        </button>
      </form>
      <p>
        <Link to="/carrito">Volver al carrito</Link>
      </p>
    </main>
  )
}
