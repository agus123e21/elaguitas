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
  if (!data || data.length === 0) return <p>Sin datos aún</p>
  const max = Math.max(...data.map((d) => d.orders))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, paddingTop: 8 }}>
      {data.map((d) => (
        <div key={d.day} style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              height: `${(d.orders / max) * 100}%`,
              minHeight: 4,
              background: '#1a73e8',
              borderRadius: '4px 4px 0 0',
            }}
          />
          <div style={{ fontSize: 10, marginTop: 4 }}>{d.day.slice(5)}</div>
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

  if (error) return <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>{error}</main>
  if (!data) return <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>Cargando…</main>

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
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Panel de control</h1>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {cards.map((c) => (
          <div key={c.label} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{c.value}</div>
            <div style={{ color: '#555', fontSize: '0.85rem' }}>{c.label}</div>
          </div>
        ))}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Ventas últimos 14 días</h2>
          <BarChart data={data.salesPerDay} />
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Productos más vendidos</h2>
          {data.topProducts.length === 0 ? (
            <p>Sin datos aún</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.topProducts.map((p) => (
                <li key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
                  <span>{p.name}</span>
                  <span>
                    {p.quantity} u · {fmtMoney(p.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Clientes frecuentes</h2>
          {data.topCustomers.length === 0 ? (
            <p>Sin datos aún</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.topCustomers.map((c) => (
                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
                  <span>{c.name}</span>
                  <span>
                    {c.orders} pedidos · {fmtMoney(c.spent)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Pedidos por estado</h2>
          {data.ordersByStatus.length === 0 ? (
            <p>Sin datos aún</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.ordersByStatus.map((s) => (
                <li key={s.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
                  <span>{STATUS_LABELS[s.status] || s.status}</span>
                  <span>{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Productos con poco stock</h2>
          {data.lowStock.length === 0 ? (
            <p style={{ color: '#27ae60' }}>Stock en buen estado</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.lowStock.map((p) => (
                <li key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
                  <span>{p.name}</span>
                  <span style={{ color: '#c0392b', fontWeight: 700 }}>{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
