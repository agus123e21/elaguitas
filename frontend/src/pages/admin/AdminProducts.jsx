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
    <div className="page" style={{ maxWidth: 1000 }}>
      <h1>Gestión de productos</h1>
      {error && <p className="alert alert--error">{error}</p>}

      <form onSubmit={handleSubmit} className="form card" style={{ maxWidth: 600 }}>
        <h2 className="card__title">{editingId ? `Editar producto #${editingId}` : 'Nuevo producto'}</h2>
        <input
          className="input"
          placeholder="Nombre"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="form-inline">
          <input
            className="input"
            style={{ flex: 1, minWidth: 160 }}
            placeholder="Precio"
            type="number"
            required
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="input"
            style={{ flex: 1, minWidth: 160 }}
            placeholder="Stock"
            type="number"
            required
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <button className="btn btn-primary btn-sm" type="submit">{editingId ? 'Guardar cambios' : 'Crear producto'}</button>
      </form>

      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td><span className={`badge ${p.active ? 'badge--success' : 'badge--inactive'}`}>{p.active ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                  <div className="form-inline">
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Editar</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(p)}>{p.active ? 'Desactivar' : 'Activar'}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(p)}>Eliminar</button>
                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                      Imagen
                      <input type="file" accept="image/*" hidden onChange={(e) => handleImage(e, p)} />
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
