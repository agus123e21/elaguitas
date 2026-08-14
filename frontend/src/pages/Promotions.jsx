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
    <div className="page">
      <h1>Promociones</h1>
      {error && <p className="alert alert--error">{error}</p>}
      {promotions.length === 0 && !error && <p className="muted">No hay promociones activas.</p>}
      <div className="grid grid--cards">
        {promotions.map((p) => (
          <div key={p.id} className="card">
            <div className="card__title">
              <strong>{p.name}</strong>
              {p.code && <span className="badge badge--success">{p.code}</span>}
            </div>
            <p className="muted">
              {TYPE_LABELS[p.type] ? TYPE_LABELS[p.type](p) : p.type}
              {p.min_order_amount ? ` · desde $${p.min_order_amount}` : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
