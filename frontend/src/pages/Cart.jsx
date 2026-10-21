import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import {
  ShoppingBagIcon,
  TrashIcon,
  ChevronRightIcon,
  PlusIcon,
  PackageIcon,
} from '../components/Icons.jsx'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, count } = useCart()

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
          Agregá bidones retornables o dispensers desde el catálogo para coordinar tu entrega en San Rafael.
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
          <PackageIcon size={18} />
          <span>Explorar Catálogo</span>
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 680, margin: '0 auto', paddingBottom: '7rem' }}>
      {/* Header del Carrito */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tu Pedido ({count} {count === 1 ? 'producto' : 'productos'})
          </span>
          <h1 style={{ fontSize: '1.8rem', margin: '0.2rem 0 0', fontWeight: 900, color: 'var(--text)' }}>
            Mi Carrito
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--danger)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '0.4rem 0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
          title="Vaciar todo el carrito"
        >
          <TrashIcon size={15} />
          <span>Vaciar</span>
        </button>
      </div>

      {/* Lista de Productos en el Carrito */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {items.map((item) => (
          <div
            key={item.productId}
            className="card"
            style={{
              padding: '1.15rem 1.25rem',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text)', display: 'block' }}>
                  {item.name}
                </strong>
                <span className="muted" style={{ fontSize: '0.82rem' }}>
                  {formatPrice(item.price)} por unidad
                </span>
              </div>

              {/* Botón directo de eliminar producto */}
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                }}
                aria-label={`Quitar ${item.name}`}
              >
                <TrashIcon size={16} />
                <span>Quitar</span>
              </button>
            </div>

            {/* Controles de Cantidad y Total de la fila */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              {/* Botones de incremento / decremento táctil */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--surface-raised)',
                  padding: '0.25rem 0.4rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: item.quantity === 1 ? 'var(--danger)' : 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                  title={item.quantity === 1 ? 'Quitar del carrito' : 'Reducir cantidad'}
                >
                  {item.quantity === 1 ? <TrashIcon size={14} /> : '−'}
                </button>

                <span
                  style={{
                    minWidth: '28px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '0.98rem',
                    color: 'var(--text)',
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                  title="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              {/* Subtotal del producto */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjeta de Resumen y Checkout */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.65rem' }}>
          <div>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text)', display: 'block' }}>Subtotal:</strong>
            <span className="muted" style={{ fontSize: '0.78rem' }}>Sin costo de envío aún</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
            {formatPrice(subtotal)}
          </span>
        </div>

        <p className="muted" style={{ fontSize: '0.82rem', margin: '0 0 1.25rem', lineHeight: 1.45 }}>
          El costo de envío según tu barrio o zona en San Rafael se confirma en el siguiente paso.
        </p>

        <Link
          to="/checkout"
          className="btn btn-primary btn-block"
          style={{
            minHeight: '52px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '1.02rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 24px rgba(11, 125, 194, 0.28)',
            textDecoration: 'none',
          }}
        >
          <span>Continuar al Paso Final</span>
          <ChevronRightIcon size={18} />
        </Link>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/productos" className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            ← Agregar otros productos
          </Link>
        </div>
      </div>
    </div>
  )
}
