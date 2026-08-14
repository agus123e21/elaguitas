import { useEffect, useState } from 'react'
import { getPromotions } from '../services/promotions.js'

const TYPE_LABELS = {
  PERCENTAGE: (p) => `${p.value}% de descuento`,
  FIXED_AMOUNT: (p) => `$${p.value} de descuento`,
  FREE_SHIPPING: () => 'Envío gratis',
  PACK: (p) => `${p.value}% off en packs`,
}

export default function Promotions() {
  const [promotions, setPromotions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getPromotions()
      .then(setPromotions)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Promociones</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {promotions.length === 0 && !error && <p>No hay promociones activas.</p>}
      {promotions.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <strong>{p.name}</strong>
          {p.code && <span style={{ display: 'inline-block', marginLeft: '0.5rem', padding: '0.1rem 0.5rem', background: '#eef4ff', borderRadius: 4, fontSize: '0.8rem' }}>{p.code}</span>}
          <p style={{ margin: '0.4rem 0', color: '#555' }}>
            {TYPE_LABELS[p.type] ? TYPE_LABELS[p.type](p) : p.type}
            {p.min_order_amount ? ` · desde $${p.min_order_amount}` : ''}
          </p>
        </div>
      ))}
    </main>
  )
}
