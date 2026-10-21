import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/products.js'
import { getProductPhoto } from '../utils/productImages.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  SearchIcon,
  CartIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ChevronRightIcon,
  ProductVisual,
  PackageIcon,
  AlertCircleIcon,
  SlidersIcon,
} from '../components/Icons.jsx'

const fmtMoney = (value) => `$${Number(value || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`

function getVisualType(name = '') {
  const n = name.toLowerCase()
  if (n.includes('dispenser')) return 'dispenser'
  if (n.includes('pack')) return 'pack'
  if (n.includes('12l') || n.includes('12 l')) return 'bottle12'
  if (n.includes('6l') || n.includes('6 l')) return 'bottle6'
  return 'bottle20'
}

export default function Catalog() {
  const { token } = useAuth()
  const { items, addItem, updateQuantity, count: cartTotalItems, subtotal: cartSubtotal } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toastState, setToastState] = useState({ message: null, type: 'success' })
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    getProducts({ token })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  function showToast(msg, type = 'success') {
    setToastState({ message: msg, type })
    setTimeout(() => setToastState({ message: null, type: 'success' }), 2400)
  }

  function handleAdd(product, qty = 1) {
    const currentItem = items.find((i) => i.productId === product.id)
    const currentQty = currentItem ? currentItem.quantity : 0
    const max = typeof product.stock === 'number' ? product.stock : 999

    if (currentQty + qty > max) {
      showToast(`Stock máximo: ${max} unidades`, 'warning')
      return
    }

    addItem(product, qty)
    showToast(`Agregaste ${product.name}`, 'success')
  }

  function getItemInCart(productId) {
    return items.find((i) => i.productId === productId)
  }

  // Desduplicación garantizada: Sólo productos activos y sin nombres repetidos
  const filteredProducts = useMemo(() => {
    const seenNames = new Set()
    return products.filter((p) => {
      if (p.active === false) return false

      const cleanName = p.name.trim().toLowerCase()
      if (seenNames.has(cleanName)) return false
      seenNames.add(cleanName)

      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))

      if (!matchSearch) return false

      if (selectedCategory === '20L') return p.name.includes('20')
      if (selectedCategory === '12L') return p.name.includes('12')
      if (selectedCategory === 'DISPENSER') return p.name.toLowerCase().includes('dispenser')
      if (selectedCategory === 'PACKS') return p.name.toLowerCase().includes('pack')
      return true
    })
  }, [products, searchQuery, selectedCategory])

  return (
    <div className="page" style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '7.5rem' }}>
      {/* Toast Feedback Táctil */}
      {toastState.message && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '64px',
            left: '1rem',
            right: '1rem',
            maxWidth: '360px',
            margin: '0 auto',
            zIndex: 9999,
            background:
              toastState.type === 'warning'
                ? '#b45309'
                : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: '#fff',
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 10px 25px rgba(2, 132, 199, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.86rem',
            fontWeight: 800,
            animation: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {toastState.type === 'warning' ? (
            <AlertCircleIcon size={16} color="#ffffff" />
          ) : (
            <CheckIcon size={16} color="#ffffff" />
          )}
          <span>{toastState.message}</span>
        </div>
      )}

      {/* Header del Catálogo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            SAN RAFAEL
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0.1rem 0 0', letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Catálogo
          </h1>
        </div>

        <Link
          to="/carrito"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.82rem',
            border: '1px solid var(--border)',
            background: cartTotalItems > 0 ? 'var(--primary-light)' : '#ffffff',
            color: cartTotalItems > 0 ? 'var(--primary-dark)' : 'var(--text)',
            padding: '0.45rem 0.95rem',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <CartIcon size={16} color={cartTotalItems > 0 ? 'var(--primary-dark)' : 'var(--text)'} />
          <span>Carrito</span>
          {cartTotalItems > 0 && (
            <span
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 900,
              }}
            >
              {cartTotalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Buscador Píldora */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
          <SearchIcon size={18} />
        </div>
        <input
          type="text"
          placeholder="Buscar producto…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: '46px',
            padding: '0 1rem 0 2.85rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)',
            background: '#ffffff',
            fontSize: '0.88rem',
            color: 'var(--text)',
            outline: 'none',
            boxShadow: 'var(--shadow-xs)',
          }}
        />
      </div>

      {/* Chips Píldora de Categorías */}
      <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
        {[
          { id: 'ALL', label: 'Todos' },
          { id: '20L', label: 'Bidón 20L' },
          { id: '12L', label: '12L' },
          { id: 'DISPENSER', label: 'Dispensadores' },
          { id: 'PACKS', label: 'Packs' },
        ].map((cat) => {
          const active = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: active ? 'var(--primary)' : '#ffffff',
                color: active ? '#ffffff' : 'var(--text)',
                fontSize: '0.82rem',
                fontWeight: active ? 800 : 600,
                cursor: 'pointer',
                boxShadow: active ? '0 4px 12px var(--primary-glow)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', borderRadius: 'var(--radius-lg)' }}>
          <p className="muted" style={{ margin: 0, fontWeight: 700 }}>Cargando productos…</p>
        </div>
      )}

      {/* Cuadrícula Curva 2 Columnas */}
      {!loading && (
        <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          {filteredProducts.map((p) => {
            const inStock = p.stock > 0
            const cartItem = getItemInCart(p.id)
            const qtyInCart = cartItem ? cartItem.quantity : 0
            const visualType = getVisualType(p.name)

            return (
              <article
                key={p.id}
                style={{
                  background: 'var(--surface)',
                  borderRadius: '26px',
                  padding: '1rem 0.9rem',
                  border: qtyInCart > 0 ? '2px solid var(--primary)' : '1px solid var(--border)',
                  boxShadow: qtyInCart > 0 ? '0 12px 28px -4px rgba(2, 132, 199, 0.22)' : 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div>
                  {/* Pod con Foto Real del Producto */}
                  <div
                    style={{
                      height: '116px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--surface-raised)',
                      borderRadius: '20px',
                      marginBottom: '0.65rem',
                      overflow: 'hidden',
                      padding: '0.5rem',
                    }}
                  >
                    <img
                      src={getProductPhoto(p)}
                      alt={p.name}
                      loading="lazy"
                      style={{
                        maxHeight: '106px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
                        transition: 'transform 0.2s ease',
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/products/bidon-20l.jpg';
                      }}
                    />
                  </div>

                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {p.name.includes('20') ? '20 Litros' : p.name.includes('12') ? '12 Litros' : 'Accesorio'}
                  </span>
                  <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: '0.15rem 0', color: 'var(--text)', lineHeight: 1.25 }}>
                    {p.name}
                  </h3>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)', margin: '0.25rem 0 0.65rem' }}>
                    {fmtMoney(p.price)}
                  </div>
                </div>

                {/* Control Táctil de Cantidades */}
                {qtyInCart > 0 ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr 32px',
                      alignItems: 'center',
                      background: 'var(--primary-light)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.2rem',
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: 'none',
                        background: '#ffffff',
                        fontWeight: 900,
                        cursor: 'pointer',
                        color: 'var(--primary-dark)',
                      }}
                      onClick={() => updateQuantity(p.id, qtyInCart - 1)}
                    >
                      -
                    </button>
                    <span style={{ textAlign: 'center', fontWeight: 900, color: 'var(--primary-dark)', fontSize: '0.92rem' }}>
                      {qtyInCart}
                    </span>
                    <button
                      type="button"
                      disabled={qtyInCart >= p.stock}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: 'none',
                        background: qtyInCart >= p.stock ? '#cbd5e1' : 'var(--primary)',
                        color: '#ffffff',
                        fontWeight: 900,
                        cursor: qtyInCart >= p.stock ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => handleAdd(p, 1)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!inStock}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      background: inStock ? 'var(--primary)' : '#cbd5e1',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: inStock ? 'pointer' : 'not-allowed',
                      boxShadow: inStock ? '0 4px 12px var(--primary-glow)' : 'none',
                    }}
                    onClick={() => handleAdd(p, 1)}
                  >
                    {inStock ? '+ Agregar' : 'Agotado'}
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}

      {/* Dock Inferior Flotante en Modo Claro Luminoso */}
      {cartTotalItems > 0 && (
        <aside
          style={{
            position: 'fixed',
            bottom: '76px',
            left: '1rem',
            right: '1rem',
            maxWidth: '480px',
            margin: '0 auto',
            zIndex: 80,
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            color: 'var(--text)',
            padding: '0.75rem 1.15rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 14px 35px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
              {cartTotalItems} {cartTotalItems === 1 ? 'producto' : 'productos'}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
              {fmtMoney(cartSubtotal)}
            </div>
          </div>

          <Link
            to="/checkout"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 900,
              height: '42px',
              padding: '0 1.35rem',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)',
              textDecoration: 'none',
            }}
          >
            <span>Pedir</span>
            <ChevronRightIcon size={14} color="#ffffff" />
          </Link>
        </aside>
      )}
    </div>
  )
}
