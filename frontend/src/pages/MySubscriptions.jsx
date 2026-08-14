import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getProducts } from '../services/products.js'
import { getAddresses } from '../services/addresses.js'
import { getMySubscriptions, createSubscription, updateSubscription } from '../services/subscriptions.js'

const FREQUENCIES = [
  { value: 3, label: 'Cada 3 días' },
  { value: 7, label: 'Cada 7 días' },
  { value: 15, label: 'Cada 15 días' },
  { value: 30, label: 'Cada 30 días' },
]

const STATUS_LABELS = { ACTIVE: 'Activa', PAUSED: 'Pausada', CANCELLED: 'Cancelada' }

export default function MySubscriptions() {
  const { token } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [products, setProducts] = useState([])
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ productId: '', addressId: '', quantity: 1, frequencyDays: 7 })

  function load() {
    getMySubscriptions(token).then(setSubscriptions).catch((e) => setError(e.message))
    getProducts({}).then(setProducts).catch(() => {})
    getAddresses(token).then(setAddresses).catch(() => {})
  }

  useEffect(load, [token])

  function handleCreate(e) {
    e.preventDefault()
    createSubscription({ ...form, productId: Number(form.productId), addressId: Number(form.addressId), frequencyDays: Number(form.frequencyDays) }, token)
      .then(() => {
        setForm({ ...form, quantity: 1 })
        load()
      })
      .catch((err) => setError(err.message))
  }

  function handleChange(id, fields) {
    updateSubscription(id, fields, token).then(load).catch((err) => setError(err.message))
  }

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1>Mis suscripciones</h1>
      {error && <p className="alert alert--error">{error}</p>}

      <form onSubmit={handleCreate} className="form card">
        <h2 className="card__title">Nueva suscripción recurrente</h2>
        <select className="select" required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
          <option value="">Producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ${p.price}
            </option>
          ))}
        </select>
        <select className="select" required value={form.addressId} onChange={(e) => setForm({ ...form, addressId: e.target.value })}>
          <option value="">Dirección de entrega</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.street}, {a.city}
            </option>
          ))}
        </select>
        <select className="select" value={form.frequencyDays} onChange={(e) => setForm({ ...form, frequencyDays: e.target.value })}>
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Cantidad"
        />
        <button className="btn btn-primary btn-sm" type="submit">Crear suscripción</button>
      </form>

      {subscriptions.length === 0 && <p className="muted">No tenés suscripciones activas.</p>}

      {subscriptions.map((s) => (
        <div key={s.id} className={`card order order--${s.status === 'CANCELLED' ? 'CANCELLED' : s.status === 'ACTIVE' ? 'DELIVERED' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <strong>
              #{s.id} · {s.product_name}
            </strong>
            <span className={`badge badge--${s.status}`}>{STATUS_LABELS[s.status] || s.status}</span>
          </div>
          <p className="muted">
            {s.quantity} unidad(es) · cada {s.frequency_days} días · {s.street}, {s.city}
          </p>
          <p className="muted text-sm">Próxima entrega: {s.next_delivery_date}</p>
          <div className="form-inline">
            {s.status === 'ACTIVE' ? (
              <button className="btn btn-outline btn-sm" onClick={() => handleChange(s.id, { status: 'PAUSED' })}>Pausar</button>
            ) : (
              <button className="btn btn-outline btn-sm" onClick={() => handleChange(s.id, { status: 'ACTIVE' })}>Reanudar</button>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => handleChange(s.id, { status: 'CANCELLED' })}>Cancelar</button>
          </div>
        </div>
      ))}
    </div>
  )
}
