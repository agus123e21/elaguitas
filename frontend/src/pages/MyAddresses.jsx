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
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Mis direcciones</h1>
      {error && <p className="alert alert--error">{error}</p>}

      <form onSubmit={handleSubmit} className="form card" style={{ maxWidth: 480 }}>
        <input className="input" placeholder="Etiqueta (Casa, Trabajo)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <input className="input" placeholder="Calle y número *" required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
        <input className="input" placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <select className="select" value={form.deliveryZoneId} onChange={(e) => setForm({ ...form, deliveryZoneId: e.target.value })}>
          <option value="">Zona de reparto (seleccionar)</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} — {formatPrice(z.price)}
            </option>
          ))}
        </select>
        <button className="btn btn-primary btn-sm" type="submit">{editingId ? 'Guardar cambios' : 'Agregar dirección'}</button>
      </form>

      {addresses.map((a) => (
        <div key={a.id} className="card">
          <div className="card__title">
            <strong>{a.label}</strong>
            {a.is_primary && <span className="badge badge--success">Principal</span>}
          </div>
          <p className="muted">{a.street}, {a.city}</p>
          <p className="muted text-sm">
            {a.zone_name}: {formatPrice(a.zone_price)}
          </p>
          <div className="form-inline">
            {!a.is_primary && <button className="btn btn-outline btn-sm" onClick={() => handleSetPrimary(a)}>Hacer principal</button>}
            <button className="btn btn-ghost btn-sm" onClick={() => startEdit(a)}>Editar</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  )
}
