import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
        <h1>Tu carrito está vacío</h1>
        <Link to="/productos">Ver productos</Link>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Carrito</h1>
      {items.map((item) => (
        <div
          key={item.productId}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            padding: '0.5rem 0',
          }}
        >
          <div>
            <strong>{item.name}</strong>
            <div style={{ color: '#555', fontSize: '0.9rem' }}>{formatPrice(item.price)} c/u</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            <button onClick={() => removeItem(item.productId)}>Quitar</button>
          </div>
        </div>
      ))}
      <p style={{ fontWeight: 700, marginTop: '1rem' }}>
        Subtotal: {formatPrice(subtotal)}
      </p>
      <Link to="/checkout" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
        Continuar compra
      </Link>
    </main>
  )
}
