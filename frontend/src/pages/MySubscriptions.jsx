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
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Mis suscripciones</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', display: 'grid', gap: '0.6rem' }}>
        <h2 style={{ fontSize: '1rem', margin: 0 }}>Nueva suscripción recurrente</h2>
        <select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
          <option value="">Producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ${p.price}
            </option>
          ))}
        </select>
        <select required value={form.addressId} onChange={(e) => setForm({ ...form, addressId: e.target.value })}>
          <option value="">Dirección de entrega</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.street}, {a.city}
            </option>
          ))}
        </select>
        <select value={form.frequencyDays} onChange={(e) => setForm({ ...form, frequencyDays: e.target.value })}>
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Cantidad"
        />
        <button type="submit">Crear suscripción</button>
      </form>

      {subscriptions.length === 0 && <p>No tenés suscripciones activas.</p>}

      {subscriptions.map((s) => (
        <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <strong>
              #{s.id} · {s.product_name}
            </strong>
            <span>{STATUS_LABELS[s.status] || s.status}</span>
          </div>
          <p style={{ margin: '0.4rem 0' }}>
            {s.quantity} unidad(es) · cada {s.frequency_days} días · {s.street}, {s.city}
          </p>
          <p style={{ margin: '0.2rem 0', color: '#555' }}>Próxima entrega: {s.next_delivery_date}</p>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            {s.status === 'ACTIVE' ? (
              <button onClick={() => handleChange(s.id, { status: 'PAUSED' })}>Pausar</button>
            ) : (
              <button onClick={() => handleChange(s.id, { status: 'ACTIVE' })}>Reanudar</button>
            )}
            <button onClick={() => handleChange(s.id, { status: 'CANCELLED' })}>Cancelar</button>
          </div>
        </div>
      ))}
    </main>
  )
}
