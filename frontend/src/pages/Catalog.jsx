import { useEffect, useState } from 'react'
import { getProducts } from '../services/products.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

const fmtMoney = (value) => `$${Number(value).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`

export default function Catalog() {
  const { token } = useAuth()
  const { items, addItem, updateQuantity, count: cartTotalItems, subtotal: cartSubtotal } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('ALL') // 'ALL', 'BIDONES', 'ACCESORIOS'

  useEffect(() => {
    setLoading(true)
    getProducts({ token })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  function handleAdd(product) {
    addItem(product, 1)
    showToast(`💧 ¡Agregaste 1x ${product.name}!`)
  }

  function getItemInCart(productId) {
    return items.find((i) => i.productId === productId)
  }

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'BIDONES') return p.volume_liters || p.name.toLowerCase().includes('bidón')
    if (activeTab === 'ACCESORIOS') return !p.volume_liters && !p.name.toLowerCase().includes('bidón')
    return true
  })

  return (
    <div className="page">
      {/* Toast Feedback Flotante Superior con Animación */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: '1rem',
            right: '1rem',
            maxWidth: '440px',
            margin: '0 auto',
            zIndex: 100,
            background: 'linear-gradient(135deg, #0b7dc2 0%, #10b981 100%)',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 8px 20px rgba(11, 125, 194, 0.35)',
            textAlign: 'center',
            fontSize: '0.92rem',
            fontWeight: 700,
            animation: 'slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header del Catálogo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            TIENDA DE AGUA PURIFICADA
          </span>
          <h1 style={{ fontSize: '1.65rem', margin: '0.1rem 0 0' }}>Catálogo Oficial</h1>
        </div>

        <Link
          to="/carrito"
          className="btn btn-outline btn-sm"
          style={{
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            borderColor: cartTotalItems > 0 ? 'var(--primary)' : '#cbd5e1',
            background: cartTotalItems > 0 ? 'var(--primary-light)' : '#ffffff',
          }}
        >
          🛒 Mi Pedido {cartTotalItems > 0 && <span style={{ color: 'var(--primary-dark)', marginLeft: '3px' }}>({cartTotalItems})</span>}
        </Link>
      </div>

      {/* Selector de Categorías en Píldoras */}
      <div className="tabs" style={{ marginBottom: '1.15rem' }}>
        <button
          className={`tabs__btn ${activeTab === 'ALL' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          💧 Todos ({products.length})
        </button>
        <button
          className={`tabs__btn ${activeTab === 'BIDONES' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('BIDONES')}
        >
          🧴 Bidones y Packs
        </button>
        <button
          className={`tabs__btn ${activeTab === 'ACCESORIOS' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('ACCESORIOS')}
        >
          🚰 Dispensadores
        </button>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
          <p className="muted" style={{ margin: 0, fontWeight: 600 }}>Cargando catálogo en tiempo real…</p>
        </div>
      )}

      {/* Cuadrícula Mobile de 2 Columnas */}
      {!loading && (
        <div className="grid--products-2col">
          {filteredProducts.map((p) => {
            const inStock = p.stock > 0
            const cartItem = getItemInCart(p.id)
            const qtyInCart = cartItem ? cartItem.quantity : 0

            return (
              <article
                key={p.id}
                className="product-card-2col"
                style={{
                  border: qtyInCart > 0 ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: qtyInCart > 0 ? '#faffff' : '#ffffff',
                }}
              >
                <div>
                  {/* Visual del Producto */}
                  <div className="product-card-2col__img-wrap">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="product-card-2col__icon">
                        {p.volume_liters ? '💧' : '🚰'}
                      </div>
                    )}

                    {/* Badge de Stock o Badge de "En tu pedido" */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: qtyInCart > 0
                          ? 'var(--primary)'
                          : inStock
                          ? 'rgba(220, 252, 231, 0.95)'
                          : 'rgba(254, 226, 226, 0.95)',
                        color: qtyInCart > 0 ? '#ffffff' : inStock ? '#15803d' : '#b91c1c',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {qtyInCart > 0 ? `✓ En pedido (${qtyInCart})` : inStock ? 'En stock' : 'Sin stock'}
                    </span>
                  </div>

                  {/* Nombre y Descripción */}
                  <h3 className="product-card-2col__name" title={p.name}>
                    {p.name}
                  </h3>
                  <p className="product-card-2col__desc" title={p.description}>
                    {p.description || 'Agua purificada y envasada con control de calidad.'}
                  </p>
                </div>

                {/* Precio y Selector Táctil */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.2rem' }}>
                    <span className="product-card-2col__price">{fmtMoney(p.price)}</span>
                    {p.volume_liters && (
                      <span className="muted" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                        {p.volume_liters}L
                      </span>
                    )}
                  </div>

                  {/* Si ya está en el carrito, mostrar control de cantidad (+ / -); si no, botón Agregar */}
                  {qtyInCart > 0 ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '36px 1fr 36px',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '0.5rem',
                        background: 'var(--primary-light)',
                        padding: '0.2rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #bae6fd',
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ minHeight: '34px', padding: 0, fontWeight: 800, fontSize: '1rem', background: '#fff' }}
                        onClick={() => updateQuantity(p.id, qtyInCart - 1)}
                      >
                        -
                      </button>
                      <span style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
                        {qtyInCart}
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ minHeight: '34px', padding: 0, fontWeight: 800, fontSize: '1rem' }}
                        disabled={qtyInCart >= p.stock}
                        onClick={() => handleAdd(p)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary product-card-2col__btn"
                      disabled={!inStock}
                      onClick={() => handleAdd(p)}
                    >
                      {inStock ? '+ Agregar' : 'Agotado'}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Dock Flotante de Resumen de Pedido */}
      {cartTotalItems > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '72px',
            left: '1rem',
            right: '1rem',
            maxWidth: '520px',
            margin: '0 auto',
            zIndex: 80,
            background: 'linear-gradient(135deg, #0b7dc2 0%, #075a8c 100%)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius)',
            boxShadow: '0 10px 28px rgba(11, 125, 194, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideUp 0.25s ease-out',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', opacity: 0.95 }}>
              📦 <strong>{cartTotalItems} {cartTotalItems === 1 ? 'producto' : 'productos'}</strong> en tu pedido
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
              {fmtMoney(cartSubtotal)}
            </div>
          </div>

          <Link
            to="/checkout"
            className="btn"
            style={{
              background: '#ffffff',
              color: 'var(--primary-dark)',
              fontWeight: 800,
              minHeight: '42px',
              padding: '0.5rem 1.1rem',
              fontSize: '0.92rem',
              boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
            }}
          >
            Confirmar Pedido ➔
          </Link>
        </div>
      )}
    </div>
  )
}
