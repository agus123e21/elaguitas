import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getContainerSummary, getContainerMovements } from '../services/containers.js'

const TYPE_LABELS = {
  DELIVERED: 'Entregado',
  RETURNED: 'Devuelto',
  ADJUSTED: 'Ajuste',
}

export default function Containers() {
  const { token } = useAuth()
  const [summary, setSummary] = useState(null)
  const [movements, setMovements] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getContainerSummary(token).then(setSummary).catch((e) => setError(e.message))
    getContainerMovements(token).then(setMovements).catch((e) => setError(e.message))
  }, [token])

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Mis bidones</h1>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{summary.delivered}</div>
            <div>Entregados</div>
          </div>
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{summary.returned}</div>
            <div>Devueltos</div>
          </div>
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{summary.pending}</div>
            <div>Pendientes</div>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '1.1rem' }}>Historial</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Pedido</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{new Date(m.created_at).toLocaleString('es-AR')}</td>
              <td>{TYPE_LABELS[m.type] || m.type}</td>
              <td>{m.quantity}</td>
              <td>{m.order_id ? `#${m.order_id}` : '-'}</td>
              <td>{m.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
