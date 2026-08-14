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
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Zonas de reparto</h1>
      {error && <p className="alert alert--error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-inline card">
        <input className="input" style={{ flex: 1, minWidth: 180 }} placeholder="Nombre (ej: Zona 4)" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" style={{ flex: 1, minWidth: 160 }} placeholder="Costo de envío" type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <button className="btn btn-primary btn-sm" type="submit">Agregar zona</button>
      </form>

      {zones.map((z) => (
        <div key={z.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <div>
            <strong>{z.name}</strong> — {formatPrice(z.price)}
            <p className={`muted text-sm ${z.active ? 'text-success' : 'text-danger'}`}>
              {z.active ? 'Activa' : 'Inactiva'}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => handleToggle(z)}>{z.active ? 'Desactivar' : 'Activar'}</button>
        </div>
      ))}
    </div>
  )
}
