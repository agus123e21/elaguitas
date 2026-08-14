import { useEffect, useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  uploadProductImage,
} from '../../services/products.js'
import { useAuth } from '../../context/AuthContext.jsx'

const emptyForm = { name: '', description: '', price: '', stock: 0 }

export default function AdminProducts() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  async function load() {
    try {
      setProducts(await getProducts({ token, includeInactive: true }))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
    const action = editingId
      ? updateProduct(editingId, payload, token)
      : createProduct(payload, token)
    action
      .then(() => {
        setForm(emptyForm)
        setEditingId(null)
        load()
      })
      .catch((err) => setError(err.message))
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      stock: p.stock,
    })
    setError(null)
  }

  function toggleActive(p) {
    patchProduct(p.id, { active: !p.active }, token).then(load).catch((err) => setError(err.message))
  }

  function handleRemove(p) {
    if (window.confirm(`¿Desactivar "${p.name}"?`)) {
      deleteProduct(p.id, token).then(load).catch((err) => setError(err.message))
    }
  }

  async function handleImage(e, p) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadProductImage(file, token)
      await patchProduct(p.id, { image: url }, token)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Gestión de productos</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 600, marginBottom: '2rem' }}>
        <input
          placeholder="Nombre"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            placeholder="Precio"
            type="number"
            required
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Stock"
            type="number"
            required
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <button type="submit">{editingId ? 'Guardar cambios' : 'Crear producto'}</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.stock}</td>
              <td>{p.active ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button onClick={() => startEdit(p)}>Editar</button>{' '}
                <button onClick={() => toggleActive(p)}>{p.active ? 'Desactivar' : 'Activar'}</button>{' '}
                <button onClick={() => handleRemove(p)}>Eliminar</button>{' '}
                <label style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                  Imagen
                  <input type="file" accept="image/*" hidden onChange={(e) => handleImage(e, p)} />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
