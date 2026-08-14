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
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Gestión de bidones</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <form onSubmit={handleRegister} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="number"
          min="1"
          max="500"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit">Registrar bidones</button>
      </form>

      <form onSubmit={handleAdjust} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select required value={adjust.customerId} onChange={(e) => setAdjust({ ...adjust, customerId: e.target.value })}>
          <option value="">Cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
        <select value={adjust.type} onChange={(e) => setAdjust({ ...adjust, type: e.target.value })}>
          <option value="DELIVERED">Entrega</option>
          <option value="RETURNED">Devolución</option>
          <option value="ADJUSTED">Ajuste</option>
        </select>
        <input
          type="number"
          min="1"
          value={adjust.quantity}
          onChange={(e) => setAdjust({ ...adjust, quantity: e.target.value })}
        />
        <input placeholder="Nota" value={adjust.notes} onChange={(e) => setAdjust({ ...adjust, notes: e.target.value })} />
        <button type="submit">Registrar movimiento</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th>ID</th>
            <th>Estado</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>#{c.id}</td>
              <td>{STATUS_LABELS[c.status] || c.status}</td>
              <td>{c.customer_name || '-'}</td>
              <td>
                <button onClick={() => handleStatus(c, 'IN_STOCK')}>Stock</button>{' '}
                <button onClick={() => handleStatus(c, 'DAMAGED')}>Dañado</button>{' '}
                <button onClick={() => handleStatus(c, 'RETIRED')}>Retirado</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
