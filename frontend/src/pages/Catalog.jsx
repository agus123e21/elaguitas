import { useEffect, useState } from 'react'
import { getProducts } from '../services/products.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

const fmtMoney = (value) => `$${Number(value).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`

export default function Catalog() {
  const { token } = useAuth()
  const { cart, addItem } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    setLoading(true)
    getProducts({ token })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  function handleAddToCart(prod) {
    addItem(prod)
    setAddedId(prod.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const cartTotalItems = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0
  const cartSubtotal = cart?.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0) || 0

  return (
    <div className="page">
      {/* Header del Catálogo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            TIENDA OFICIAL
          </span>
          <h1 style={{ fontSize: '1.65rem', margin: '0.1rem 0 0' }}>Catálogo de Productos</h1>
        </div>

        <Link to="/carrito" className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
          🛒 Carrito {cartTotalItems > 0 && <span style={{ color: 'var(--primary)', marginLeft: '3px' }}>({cartTotalItems})</span>}
        </Link>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p className="muted" style={{ margin: 0 }}>Cargando catálogo de agua purificada…</p>
        </div>
      )}

      {/* Cuadrícula Mobile de 2 Columnas */}
      {!loading && (
        <div className="grid--products-2col">
          {products.map((p) => {
            const inStock = p.stock > 0
            const isAdded = addedId === p.id

            return (
              <article key={p.id} className="product-card-2col">
                <div>
                  {/* Imagen / Visual del Producto */}
                  <div className="product-card-2col__img-wrap">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="product-card-2col__icon">💧</div>
                    )}

                    {/* Badge de Stock en la esquina */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        background: inStock ? 'rgba(220, 252, 231, 0.95)' : 'rgba(254, 226, 226, 0.95)',
                        color: inStock ? '#15803d' : '#b91c1c',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {inStock ? 'En stock' : 'Sin stock'}
                    </span>
                  </div>

                  {/* Título y Descripción */}
                  <h3 className="product-card-2col__name" title={p.name}>
                    {p.name}
                  </h3>
                  <p className="product-card-2col__desc" title={p.description}>
                    {p.description || 'Agua purificada y tratada con los más altos estándares.'}
                  </p>
                </div>

                {/* Precio y Botón de Compra */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.2rem' }}>
                    <span className="product-card-2col__price">{fmtMoney(p.price)}</span>
                    {p.volume_liters && (
                      <span className="muted" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                        {p.volume_liters}L
                      </span>
                    )}
                  </div>

                  <button
                    className={`btn product-card-2col__btn ${isAdded ? 'btn-success' : 'btn-primary'}`}
                    disabled={!inStock}
                    onClick={() => handleAddToCart(p)}
                  >
                    {isAdded ? '✓ ¡Agregado!' : inStock ? '+ Agregar' : 'Agotado'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Barra Flotante de Resumen de Carrito si hay productos */}
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
            boxShadow: '0 8px 24px rgba(11, 125, 194, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideUp 0.25s ease-out',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>
              {cartTotalItems} {cartTotalItems === 1 ? 'producto' : 'productos'} en tu pedido
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {fmtMoney(cartSubtotal)}
            </div>
          </div>

          <Link
            to="/carrito"
            className="btn"
            style={{
              background: '#ffffff',
              color: 'var(--primary-dark)',
              fontWeight: 800,
              minHeight: '38px',
              padding: '0.45rem 1rem',
              fontSize: '0.88rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            Ver Carrito ➔
          </Link>
        </div>
      )}
    </div>
  )
}
