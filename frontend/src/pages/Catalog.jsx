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
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Productos</h1>
        <Link className="btn btn-outline btn-sm" to="/carrito">Ver carrito</Link>
      </div>
      {error && <p className="alert alert--error">{error}</p>}
      <div className="grid grid--cards">
        {products.map((p) => (
          <article key={p.id} className="card product">
            {p.image ? (
              <img className="product__img" src={p.image} alt={p.name} />
            ) : (
              <div
                className="product__img"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}
              >
                Sin imagen
              </div>
            )}
            <h3 className="product__name" style={{ margin: 0 }}>{p.name}</h3>
            <p className="product__desc">{p.description}</p>
            <p className={p.stock > 0 ? 'text-sm text-success' : 'text-sm text-danger'}>
              {p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock'}
            </p>
            <div className="product__footer">
              <span className="product__price">{formatPrice(p.price)}</span>
              <button className="btn btn-primary btn-sm" disabled={p.stock <= 0} onClick={() => addItem(p)}>
                Agregar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
