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
      <div className="page" style={{ maxWidth: 640 }}>
        <h1>Tu carrito está vacío</h1>
        <Link className="btn btn-primary" to="/productos">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1>Carrito</h1>
      {items.map((item) => (
        <div
          key={item.productId}
          className="card card--flat"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}
        >
          <div>
            <strong>{item.name}</strong>
            <div className="muted text-sm">{formatPrice(item.price)} c/u</div>
          </div>
          <div className="form-inline" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.productId)}>Quitar</button>
          </div>
        </div>
      ))}
      <div
        className="card"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}
      >
        <strong>Subtotal: {formatPrice(subtotal)}</strong>
        <Link className="btn btn-primary" to="/checkout">Continuar compra</Link>
      </div>
    </div>
  )
}
