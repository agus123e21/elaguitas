import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  getInventory,
  registerContainers,
  updateContainerStatus,
  adjustContainers,
} from '../../services/containers.js'
import { getUsers } from '../../services/users.js'

const STATUS_LABELS = {
  IN_STOCK: 'En stock',
  WITH_CUSTOMER: 'Con cliente',
  DAMAGED: 'Dañado',
  RETIRED: 'Retirado',
}

export default function AdminContainers() {
  const { token } = useAuth()
  const [containers, setContainers] = useState([])
  const [clients, setClients] = useState([])
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(10)
  const [adjust, setAdjust] = useState({ customerId: '', type: 'DELIVERED', quantity: 1, notes: '' })

  function load() {
    getInventory(token).then(setContainers).catch((e) => setError(e.message))
    getUsers(token, { role: 'CLIENT' })
      .then(setClients)
      .catch(() => {})
  }

  useEffect(load, [token])

  function handleRegister(e) {
    e.preventDefault()
    registerContainers(Number(quantity), token)
      .then(() => {
        setQuantity(10)
        load()
      })
      .catch((err) => setError(err.message))
  }

  function handleAdjust(e) {
    e.preventDefault()
    adjustContainers({ ...adjust, customerId: Number(adjust.customerId), quantity: Number(adjust.quantity) }, token)
      .then(() => {
        setAdjust({ customerId: '', type: 'DELIVERED', quantity: 1, notes: '' })
        load()
      })
      .catch((err) => setError(err.message))
  }

  function handleStatus(container, status) {
    updateContainerStatus(container.id, { status }, token).then(load).catch((err) => setError(err.message))
  }

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <h1>Gestión de bidones</h1>
      {error && <p className="alert alert--error">{error}</p>}

      <form onSubmit={handleRegister} className="form-inline card">
        <label className="form-label">Registrar bidones en stock</label>
        <input
          className="input"
          style={{ width: 100 }}
          type="number"
          min="1"
          max="500"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button className="btn btn-primary btn-sm" type="submit">Registrar</button>
      </form>

      <form onSubmit={handleAdjust} className="form-inline card">
        <label className="form-label">Registrar movimiento por cliente</label>
        <select className="select" style={{ maxWidth: 260 }} required value={adjust.customerId} onChange={(e) => setAdjust({ ...adjust, customerId: e.target.value })}>
          <option value="">Cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
        <select className="select" value={adjust.type} onChange={(e) => setAdjust({ ...adjust, type: e.target.value })}>
          <option value="DELIVERED">Entrega</option>
          <option value="RETURNED">Devolución</option>
          <option value="ADJUSTED">Ajuste</option>
        </select>
        <input
          className="input"
          style={{ width: 100 }}
          type="number"
          min="1"
          value={adjust.quantity}
          onChange={(e) => setAdjust({ ...adjust, quantity: e.target.value })}
        />
        <input className="input" style={{ flex: 1, minWidth: 140 }} placeholder="Nota" value={adjust.notes} onChange={(e) => setAdjust({ ...adjust, notes: e.target.value })} />
        <button className="btn btn-primary btn-sm" type="submit">Registrar movimiento</button>
      </form>

      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td><span className={`badge ${c.status === 'IN_STOCK' ? 'badge--success' : c.status === 'DAMAGED' ? 'badge--pending' : 'badge--inactive'}`}>{STATUS_LABELS[c.status] || c.status}</span></td>
                <td>{c.customer_name || '-'}</td>
                <td>
                  <div className="form-inline">
                    <button className="btn btn-outline btn-sm" onClick={() => handleStatus(c, 'IN_STOCK')}>Stock</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleStatus(c, 'DAMAGED')}>Dañado</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleStatus(c, 'RETIRED')}>Retirado</button>
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
