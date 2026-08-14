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
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Mis bidones</h1>
      {error && <p className="alert alert--error">{error}</p>}

      {summary && (
        <div className="grid grid--stats">
          <div className="card kpi">
            <div className="kpi__value">{summary.delivered}</div>
            <div className="kpi__label">Entregados</div>
          </div>
          <div className="card kpi">
            <div className="kpi__value">{summary.returned}</div>
            <div className="kpi__label">Devueltos</div>
          </div>
          <div className="card kpi">
            <div className="kpi__value">{summary.pending}</div>
            <div className="kpi__label">Pendientes</div>
          </div>
        </div>
      )}

      <h2 className="section-title">Historial</h2>
      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Pedido</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td>{new Date(m.created_at).toLocaleString('es-AR')}</td>
                <td>{TYPE_LABELS[m.type] || m.type}</td>
                <td>{m.quantity}</td>
                <td>{m.order_id ? `#${m.order_id}` : '-'}</td>
                <td>{m.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
