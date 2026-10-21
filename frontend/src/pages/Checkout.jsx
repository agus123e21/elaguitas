import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getAddresses, createAddress, getZones } from '../services/addresses.js'
import { previewOrder, createOrder } from '../services/orders.js'
import { getProductPhoto } from '../utils/productImages.js'
import {
  PackageIcon,
  RefreshCwIcon,
  TruckIcon,
  MapPinIcon,
  DollarSignIcon,
  CheckIcon,
  UserIcon,
  PlusIcon,
  ShoppingBagIcon,
  AlertCircleIcon,
  LockIcon,
  ChevronRightIcon,
  ClockIcon,
  TrashIcon,
} from '../components/Icons.jsx'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default function Checkout() {
  const { user, token } = useAuth()
  const { items, subtotal, clearCart, updateQuantity, removeItem } = useCart()
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
  const [showAddressPicker, setShowAddressPicker] = useState(false)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: 'Casa', street: '', city: 'San Rafael', deliveryZoneId: '' })

  // Conteo automático de bidones del pedido
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
          setShowNewAddressForm(true)
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

  const currentAddress = addresses.find((a) => Number(a.id) === Number(addressId))

  async function handleNewAddress(e) {
    e.preventDefault()
    if (!newAddress.street.trim()) return
    try {
      const address = await createAddress(
        {
          label: newAddress.label || 'Casa',
          street: newAddress.street.trim(),
          city: newAddress.city || 'San Rafael',
          deliveryZoneId: newAddress.deliveryZoneId ? Number(newAddress.deliveryZoneId) : zones[0]?.id || 1,
        },
        token
      )
      setAddresses((prev) => [...prev, address])
      setAddressId(Number(address.id))
      setShowNewAddressForm(false)
      setShowAddressPicker(false)
      setNewAddress({ label: 'Casa', street: '', city: 'San Rafael', deliveryZoneId: zones[0]?.id || '' })
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!token) {
      setError('Debes iniciar sesión para confirmar tu pedido.')
      return
    }
    if (!addressId) {
      setError('Por favor ingresá o seleccioná una dirección de entrega en San Rafael.')
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

  // Vista 1: Carrito Vacío
  if (items.length === 0) {
    return (
      <div className="page" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '4rem 1.25rem' }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: '9999px',
            background: 'var(--primary-light)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--primary)',
          }}
        >
          <ShoppingBagIcon size={36} />
        </div>
        <h1 style={{ fontSize: '1.6rem', margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--text)' }}>
          Tu carrito está vacío
        </h1>
        <p className="muted" style={{ margin: '0 auto 2rem', fontSize: '0.94rem', lineHeight: 1.5, maxWidth: 360 }}>
          Agregá bidones o dispensers desde el catálogo para pedir agua purificada hoy en San Rafael.
        </p>
        <Link
          className="btn btn-primary"
          to="/productos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 800,
            padding: '0.9rem 1.8rem',
            borderRadius: '9999px',
          }}
        >
          <ShoppingBagIcon size={18} />
          <span>Ver Productos</span>
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    )
  }

  // Vista 2: Usuario no autenticado (Limpio y directo, sin usuarios falsos)
  if (!user || !token) {
    return (
      <div className="page" style={{ maxWidth: 460, margin: '0 auto', padding: '3rem 1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: '9999px',
              background: 'var(--primary-light)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)',
            }}
          >
            <LockIcon size={30} />
          </div>
          <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 900, color: 'var(--text)' }}>
            Confirmá tu Pedido
          </h1>
          <p className="muted" style={{ margin: '0.5rem 0 0', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Iniciá sesión o registrate para indicar tu dirección y enviar el chofer a tu domicilio.
          </p>
        </div>

        <div
          className="card"
          style={{
            padding: '1.75rem',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            background: '#ffffff',
            display: 'grid',
            gap: '1rem',
          }}
        >
          <Link
            to="/login"
            className="btn btn-primary btn-block"
            style={{
              borderRadius: '9999px',
              padding: '0.9rem 1.25rem',
              fontWeight: 800,
              fontSize: '1rem',
              textAlign: 'center',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(11, 125, 194, 0.25)',
            }}
          >
            Iniciar Sesión
          </Link>

          <Link
            to="/registro"
            className="btn btn-outline btn-block"
            style={{
              borderRadius: '9999px',
              padding: '0.85rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Crear Cuenta Nueva
          </Link>
        </div>

        <p className="muted" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem' }}>
          Los productos agregados a tu carrito se mantendrán guardados.
        </p>
      </div>
    )
  }

  const fee = preview?.deliveryFee ?? (currentAddress ? Number(currentAddress.zone_price || 1000) : 1000)
  const finalTotal = preview ? preview.total : subtotal + fee

  return (
    <div className="page" style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: '7rem' }}>
      {/* Encabezado Simple */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', padding: '0.3rem 0.75rem', borderRadius: '9999px', marginBottom: '0.5rem' }}>
          <ClockIcon size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.03em' }}>
            ENTREGA EN EL DÍA · SAN RAFAEL
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', margin: '0.2rem 0 0', fontWeight: 900, color: 'var(--text)' }}>
          Confirmar Pedido
        </h1>
        <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.92rem' }}>
          Revisá tus datos de entrega y abonás recién al recibir.
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

      <div className="checkout-desktop-layout">
        {/* Columna Izquierda: Datos esenciales (Dirección, Envases, Pago) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* 1. Dirección de Entrega */}
          <section
            className="card"
            style={{
              padding: '1.35rem 1.5rem',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                  }}
                >
                  <MapPinIcon size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: 'var(--text)' }}>
                    1. Dirección de entrega
                  </h2>
                </div>
              </div>

              {addresses.length > 0 && !showNewAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressPicker((v) => !v)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    padding: '0.4rem 0.6rem',
                  }}
                >
                  {showAddressPicker ? 'Cerrar' : 'Cambiar'}
                </button>
              )}
            </div>

            {/* Dirección actualmente seleccionada */}
            {!showAddressPicker && !showNewAddressForm && currentAddress && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1rem', color: 'var(--text)', display: 'block' }}>
                    {currentAddress.street}
                  </strong>
                  <span className="muted" style={{ fontSize: '0.82rem' }}>
                    {currentAddress.city || 'San Rafael'} {currentAddress.zone_name ? `· Zona ${currentAddress.zone_name}` : ''}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                  }}
                >
                  Confirmada
                </span>
              </div>
            )}

            {/* Selector de direcciones guardadas */}
            {showAddressPicker && !showNewAddressForm && (
              <div style={{ display: 'grid', gap: '0.65rem' }}>
                {addresses.map((a) => {
                  const isSelected = Number(a.id) === Number(addressId)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setAddressId(Number(a.id))
                        setShowAddressPicker(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                        background: isSelected ? 'rgba(11, 125, 194, 0.05)' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.94rem', color: 'var(--text)', display: 'block' }}>
                          {a.street}
                        </strong>
                        <span className="muted" style={{ fontSize: '0.78rem' }}>
                          {a.city || 'San Rafael'}
                        </span>
                      </div>
                      {isSelected && <CheckIcon size={18} color="var(--primary)" />}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem',
                    borderRadius: '16px',
                    border: '1px dashed var(--primary)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  <PlusIcon size={16} />
                  <span>Agregar otra dirección</span>
                </button>
              </div>
            )}

            {/* Formulario para agregar dirección */}
            {(showNewAddressForm || addresses.length === 0) && (
              <form onSubmit={handleNewAddress} style={{ display: 'grid', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>
                    Calle y Número:
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="ej: Av. Balloffet 1250"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    style={{ borderRadius: '14px', padding: '0.75rem 0.9rem', width: '100%' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>
                      Ciudad:
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      style={{ borderRadius: '14px', padding: '0.75rem 0.9rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>
                      Zona de entrega:
                    </label>
                    <select
                      className="input"
                      value={newAddress.deliveryZoneId}
                      onChange={(e) => setNewAddress({ ...newAddress, deliveryZoneId: e.target.value })}
                      style={{ borderRadius: '14px', padding: '0.75rem 0.9rem', width: '100%' }}
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({formatPrice(z.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: '9999px', padding: '0.75rem', fontWeight: 800 }}
                  >
                    Guardar Dirección
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowNewAddressForm(false)}
                      style={{ borderRadius: '9999px', padding: '0.75rem 1rem' }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* 2. Método de Pago */}
          <section
            className="card"
            style={{
              padding: '1.35rem 1.5rem',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <DollarSignIcon size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: 'var(--text)' }}>
                  2. ¿Cómo querés pagar?
                </h2>
                <span className="muted" style={{ fontSize: '0.78rem' }}>Pagás al recibir tu pedido</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {[
                { id: 'CASH', title: 'Efectivo', desc: 'En billetes al repartidor' },
                { id: 'TRANSFER', title: 'Transferencia Bancaria o QR', desc: 'Mercado Pago o transferencia al recibir' },
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
                      padding: '0.85rem 1.1rem',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                      background: isSelected ? 'rgba(11, 125, 194, 0.05)' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.94rem', color: 'var(--text)', display: 'block' }}>
                        {m.title}
                      </strong>
                      <span className="muted" style={{ fontSize: '0.78rem' }}>
                        {m.desc}
                      </span>
                    </div>
                    <div
                      style={{
                        width: 20,
                        height: 20,
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

          {/* 3. Recambio de Envases Retornables */}
          <section
            className="card"
            style={{
              padding: '1.35rem 1.5rem',
              borderRadius: '24px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: '#fcfdfd',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                }}
              >
                <RefreshCwIcon size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: '#065f46' }}>
                  3. Envases Retornables
                </h2>
                <span className="muted" style={{ fontSize: '0.78rem' }}>Intercambio de botellones vacíos por llenos</span>
              </div>
            </div>

            {/* Fila compacta de intercambio */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0.85rem 1rem',
                borderRadius: '16px',
                background: '#f0fdf4',
                border: '1px solid #dcfce7',
                marginBottom: '0.85rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 700, display: 'block' }}>
                  RECIBÍS
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {containersDelivered}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'block' }}>
                  {containersDelivered === 1 ? 'bidón lleno' : 'bidones llenos'}
                </span>
              </div>

              <div style={{ color: 'var(--muted)', fontSize: '1.1rem', fontWeight: 700 }}>⇄</div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 700, display: 'block' }}>
                  ENTREGÁS
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: containersReturned > 0 ? 'var(--success)' : 'var(--muted)' }}>
                  {containersReturned}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'block' }}>
                  {containersReturned === 1 ? 'vacío' : 'vacíos'}
                </span>
              </div>
            </div>

            {/* Checkbox simple primera compra */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                padding: '0.65rem 0.85rem',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <input
                type="checkbox"
                checked={isFirstPurchase}
                onChange={(e) => {
                  setIsFirstPurchase(e.target.checked)
                  if (e.target.checked) setCustomReturned(0)
                }}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text)' }}>
                Primera compra: No tengo envases vacíos para devolver
              </span>
            </label>
          </section>

        </div>

        {/* Columna Derecha / Sidebar: Resumen y Confirmación */}
        <div className="checkout-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              background: '#ffffff',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PackageIcon size={18} color="var(--primary)" />
              <span>Resumen de Compra</span>
            </h2>

            {/* Lista resumida de productos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'var(--surface-raised)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--border)',
                        padding: '2px',
                      }}
                    >
                      <img
                        src={getProductPhoto(item)}
                        alt={item.name}
                        style={{ maxHeight: '34px', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                          style={{
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontWeight: 800,
                            fontSize: '0.74rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                          }}
                        >
                          {item.quantity}x
                        </span>
                        <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.88rem' }}>{item.name}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.8,
                      }}
                      title={`Quitar ${item.name} del carrito`}
                      aria-label={`Quitar ${item.name}`}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desglose de totales */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--muted)' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--muted)' }}>
                <span>Envío a domicilio:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(fee)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '2px dashed #e2e8f0',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--text)', display: 'block' }}>Total Final:</strong>
                  <span className="muted" style={{ fontSize: '0.74rem' }}>Abonás en la entrega</span>
                </div>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Botón Principal de Confirmación */}
            <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
              <button
                className="btn btn-success btn-block"
                type="submit"
                disabled={submitting || (!addressId && !newAddress.street)}
                style={{
                  minHeight: '54px',
                  borderRadius: '9999px',
                  fontSize: '1.02rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
              >
                <CheckIcon size={20} />
                <span>{submitting ? 'Confirmando...' : `Confirmar Pedido · ${formatPrice(finalTotal)}`}</span>
              </button>
            </form>

            <p style={{ textAlign: 'center', margin: '0.85rem 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
              🔒 Tu pedido se envía directamente al chofer asignado de San Rafael.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/productos" className="muted" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              ← Volver al catálogo
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
