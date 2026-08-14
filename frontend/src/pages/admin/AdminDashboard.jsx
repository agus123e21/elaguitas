import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDashboard } from '../../services/dashboard.js'

const fmtMoney = (n) => `$${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
const STATUS_LABELS = {
  PENDING: 'Pendientes',
  OUT_FOR_DELIVERY: 'En reparto',
  DELIVERED: 'Entregados',
  CANCELLED: 'Cancelados',
}

function BarChart({ data }) {
  if (!data || data.length === 0) return <p className="muted">Sin datos aún</p>
  const max = Math.max(...data.map((d) => d.orders))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, paddingTop: 8 }}>
      {data.map((d) => (
        <div key={d.day} style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              height: `${(d.orders / max) * 100}%`,
              minHeight: 4,
              background: 'var(--primary)',
              borderRadius: '4px 4px 0 0',
            }}
          />
          <div className="muted" style={{ fontSize: 10, marginTop: 4 }}>{d.day.slice(5)}</div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboard(token).then(setData).catch((e) => setError(e.message))
  }, [token])

  if (error) return <div className="page"><p className="alert alert--error">{error}</p></div>
  if (!data) return <div className="page"><p className="muted">Cargando…</p></div>

  const cards = [
    { label: 'Pedidos hoy', value: data.cards.ordersToday },
    { label: 'Ventas hoy', value: fmtMoney(data.cards.salesToday) },
    { label: 'Pendientes', value: data.cards.pendingOrders },
    { label: 'En reparto', value: data.cards.outForDelivery },
    { label: 'Entregados', value: data.cards.deliveredOrders },
    { label: 'Bidones por reponer', value: data.cards.pendingContainers },
    { label: 'Clientes', value: data.cards.customers },
    { label: 'Repartidores', value: data.cards.drivers },
  ]

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <h1>Panel de control</h1>

      <div className="grid grid--stats">
        {cards.map((c) => (
          <div key={c.label} className="card kpi">
            <div className="kpi__value">{c.value}</div>
            <div className="kpi__label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid--halves">
        <div className="card">
          <h2 className="card__title">Ventas últimos 14 días</h2>
          <BarChart data={data.salesPerDay} />
        </div>

        <div className="card">
          <h2 className="card__title">Productos más vendidos</h2>
          {data.topProducts.length === 0 ? (
            <p className="muted">Sin datos aún</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.topProducts.map((p) => (
                <li key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{p.name}</span>
                  <span>
                    {p.quantity} u · {fmtMoney(p.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="card__title">Clientes frecuentes</h2>
          {data.topCustomers.length === 0 ? (
            <p className="muted">Sin datos aún</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.topCustomers.map((c) => (
                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{c.name}</span>
                  <span>
                    {c.orders} pedidos · {fmtMoney(c.spent)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="card__title">Pedidos por estado</h2>
          {data.ordersByStatus.length === 0 ? (
            <p className="muted">Sin datos aún</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.ordersByStatus.map((s) => (
                <li key={s.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{STATUS_LABELS[s.status] || s.status}</span>
                  <span>{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="card__title">Productos con poco stock</h2>
          {data.lowStock.length === 0 ? (
            <p className="text-success">Stock en buen estado</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.lowStock.map((p) => (
                <li key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{p.name}</span>
                  <span className="text-danger" style={{ fontWeight: 700 }}>{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
