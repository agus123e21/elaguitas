import { useEffect, useState } from 'react'
import { getProducts } from '../services/products.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Catalog() {
  const { token } = useAuth()
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts({ token })
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [token])

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Productos</h1>
        <Link to="/carrito">Ver carrito</Link>
      </div>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {products.map((p) => (
          <article key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }}
              />
            ) : (
              <div
                style={{
                  height: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                  borderRadius: 6,
                  color: '#999',
                }}
              >
                Sin imagen
              </div>
            )}
            <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{p.name}</h3>
            <p style={{ margin: 0, color: '#555', minHeight: 40 }}>{p.description}</p>
            <p style={{ fontWeight: 700 }}>{formatPrice(p.price)}</p>
            <p style={{ color: p.stock > 0 ? '#2e7d32' : '#c0392b', fontSize: '0.85rem' }}>
              {p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock'}
            </p>
            <button disabled={p.stock <= 0} onClick={() => addItem(p)}>
              Agregar al carrito
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}
