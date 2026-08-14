import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getZones } from '../../services/addresses.js'
import { createZone, updateZone } from '../../services/zones.js'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminZones() {
  const { token } = useAuth()
  const [zones, setZones] = useState([])
  const [form, setForm] = useState({ name: '', price: '' })
  const [error, setError] = useState(null)

  function load() {
    getZones(token, { all: true }).then(setZones).catch((e) => setError(e.message))
  }

  useEffect(load, [token])

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { name: form.name, price: Number(form.price) }
    createZone(payload, token)
      .then(() => {
        setForm({ name: '', price: '' })
        load()
      })
      .catch((err) => setError(err.message))
  }

  function handleToggle(z) {
    updateZone(z.id, { active: !z.active }, token).then(load).catch((err) => setError(err.message))
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Zonas de reparto</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input placeholder="Nombre (ej: Zona 4)" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Costo de envío" type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <button type="submit">Agregar zona</button>
      </form>

      {zones.map((z) => (
        <div key={z.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd', borderRadius: 8, padding: '0.75rem', marginBottom: '0.5rem' }}>
          <div>
            <strong>{z.name}</strong> — {formatPrice(z.price)}
            <p style={{ margin: 0, fontSize: '0.85rem', color: z.active ? '#2e7d32' : '#c0392b' }}>
              {z.active ? 'Activa' : 'Inactiva'}
            </p>
          </div>
          <button onClick={() => handleToggle(z)}>{z.active ? 'Desactivar' : 'Activar'}</button>
        </div>
      ))}
    </main>
  )
}
