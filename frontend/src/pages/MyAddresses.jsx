import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getAddresses, createAddress, updateAddress, deleteAddress, getZones } from '../services/addresses.js'

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

const emptyForm = { label: '', street: '', city: '', deliveryZoneId: '' }

export default function MyAddresses() {
  const { token } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [zones, setZones] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  function load() {
    getAddresses(token).then(setAddresses).catch((e) => setError(e.message))
    getZones(token).then(setZones).catch(() => {})
  }

  useEffect(load, [token])

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form, deliveryZoneId: form.deliveryZoneId ? Number(form.deliveryZoneId) : null }
    const action = editingId ? updateAddress(editingId, payload, token) : createAddress(payload, token)
    action
      .then(() => {
        setForm(emptyForm)
        setEditingId(null)
        load()
      })
      .catch((err) => setError(err.message))
  }

  function startEdit(a) {
    setEditingId(a.id)
    setForm({ label: a.label || '', street: a.street, city: a.city || '', deliveryZoneId: String(a.delivery_zone_id || '') })
    setError(null)
  }

  function handleSetPrimary(a) {
    updateAddress(a.id, { isPrimary: true }, token).then(load).catch((err) => setError(err.message))
  }

  function handleDelete(a) {
    if (window.confirm(`¿Eliminar la dirección "${a.label}"?`)) {
      deleteAddress(a.id, token).then(load).catch((err) => setError(err.message))
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Mis direcciones</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.4rem', maxWidth: 480, marginBottom: '1.5rem' }}>
        <input placeholder="Etiqueta (Casa, Trabajo)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <input placeholder="Calle y número *" required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
        <input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <select value={form.deliveryZoneId} onChange={(e) => setForm({ ...form, deliveryZoneId: e.target.value })}>
          <option value="">Zona de reparto (seleccionar)</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} — {formatPrice(z.price)}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? 'Guardar cambios' : 'Agregar dirección'}</button>
      </form>

      {addresses.map((a) => (
        <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '0.75rem', marginBottom: '0.5rem' }}>
          <strong>{a.label}</strong> {a.is_primary && <span>(principal)</span>}
          <p style={{ margin: '0.25rem 0' }}>{a.street}, {a.city}</p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            {a.zone_name}: {formatPrice(a.zone_price)}
          </p>
          {!a.is_primary && <button onClick={() => handleSetPrimary(a)}>Hacer principal</button>}{' '}
          <button onClick={() => startEdit(a)}>Editar</button>{' '}
          <button onClick={() => handleDelete(a)}>Eliminar</button>
        </div>
      ))}
    </main>
  )
}
