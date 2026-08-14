import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../../services/promotions.js'

const TYPES = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'PACK']

const TYPE_LABELS = {
  PERCENTAGE: 'Porcentaje',
  FIXED_AMOUNT: 'Monto fijo',
  FREE_SHIPPING: 'Envío gratis',
  PACK: 'Pack',
}

const empty = {
  name: '',
  code: '',
  type: 'PERCENTAGE',
  value: '',
  packQuantity: '',
  minQuantity: '',
  minOrderAmount: '',
  active: true,
  endsAt: '',
}

export default function AdminPromotions() {
  const { token } = useAuth()
  const [promotions, setPromotions] = useState([])
  const [error, setError] = useState(null)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  function load() {
    getAllPromotions(token).then(setPromotions).catch((e) => setError(e.message))
  }

  useEffect(load, [token])

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      name: form.name,
      code: form.code || null,
      type: form.type,
      value: form.value === '' ? null : Number(form.value),
      packQuantity: form.packQuantity === '' ? null : Number(form.packQuantity),
      minQuantity: form.minQuantity === '' ? null : Number(form.minQuantity),
      minOrderAmount: form.minOrderAmount === '' ? null : Number(form.minOrderAmount),
      active: form.active,
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    }
    const action = editingId ? updatePromotion(editingId, payload, token) : createPromotion(payload, token)
    action
      .then(() => {
        setForm(empty)
        setEditingId(null)
        load()
      })
      .catch((err) => setError(err.message))
  }

  function handleEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      code: p.code || '',
      type: p.type,
      value: p.value ?? '',
      packQuantity: p.pack_quantity ?? '',
      minQuantity: p.min_quantity ?? '',
      minOrderAmount: p.min_order_amount ?? '',
      active: p.active,
      endsAt: p.ends_at ? p.ends_at.slice(0, 10) : '',
    })
  }

  function handleDelete(id) {
    deletePromotion(id, token).then(load).catch((err) => setError(err.message))
  }

  function handleToggleActive(p) {
    updatePromotion(p.id, { active: !p.active }, token).then(load).catch((err) => setError(err.message))
  }

  const inputStyle = { padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4 }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Promociones</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1rem', gridColumn: '1 / -1', margin: 0 }}>
          {editingId ? `Editar promoción #${editingId}` : 'Nueva promoción'}
        </h2>
        <input required placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <input placeholder="Código" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} style={inputStyle} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        {form.type !== 'FREE_SHIPPING' && (
          <input placeholder="Valor (% o $)" type="number" step="any" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} style={inputStyle} />
        )}
        {form.type === 'PACK' && (
          <input placeholder="Unidades del pack" type="number" value={form.packQuantity} onChange={(e) => setForm({ ...form, packQuantity: e.target.value })} style={inputStyle} />
        )}
        <input placeholder="Cant. mínima" type="number" value={form.minQuantity} onChange={(e) => setForm({ ...form, minQuantity: e.target.value })} style={inputStyle} />
        <input placeholder="Monto mínimo" type="number" step="any" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} style={inputStyle} />
        <input placeholder="Vence (aaaa-mm-dd)" type="date" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Activa
        </label>
        <button type="submit">{editingId ? 'Guardar cambios' : 'Crear'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>
            Cancelar
          </button>
        )}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th>Nombre</th>
            <th>Código</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{p.name}</td>
              <td>{p.code || '-'}</td>
              <td>{TYPE_LABELS[p.type] || p.type}</td>
              <td>{p.value ?? '-'}</td>
              <td>{p.active ? 'Activa' : 'Inactiva'}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>{' '}
                <button onClick={() => handleToggleActive(p)}>{p.active ? 'Desactivar' : 'Activar'}</button>{' '}
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
