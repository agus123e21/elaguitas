import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getMyOrders, changeOrderStatus, assignDriver, createOrder } from '../../services/orders.js'
import { getUsers, createUser, updateUser } from '../../services/users.js'
import { getSystemStatus, getSystemLogs, clearSystemLogs } from '../../services/system.js'
import { getProducts } from '../../services/products.js'

const fmtMoney = (n) => `$${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'En camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const ROLE_BADGES = {
  ADMIN: { label: '👑 Admin / Dev', bg: '#fef3c7', text: '#92400e' },
  DRIVER: { label: '🚚 Repartidor', bg: '#e0f2fe', text: '#0369a1' },
  CLIENT: { label: '👤 Cliente', bg: '#f3f4f6', text: '#374151' },
}

export default function AdminDashboard() {
  const { token, user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('orders') // 'orders', 'users', 'system'

  // Orders State
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [products, setProducts] = useState([])
  const [orderFilter, setOrderFilter] = useState('')
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [newOrderModal, setNewOrderModal] = useState(false)
  const [newOrderForm, setNewOrderForm] = useState({
    customerId: '',
    addressStreet: '',
    addressCity: 'Ciudad',
    productId: '',
    quantity: 1,
    paymentMethod: 'CASH',
    driverId: '',
    notes: '',
  })

  // Users State
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [newUserModal, setNewUserModal] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DRIVER',
    phone: '',
    vehicle: 'Furgón',
  })

  // System & DB State
  const [sysStatus, setSysStatus] = useState(null)
  const [logs, setLogs] = useState([])
  const [logFilter, setLogFilter] = useState('')
  const [loadingSystem, setLoadingSystem] = useState(false)

  // Feedback State
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  function showSuccess(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  // Load Orders & Drivers
  async function loadOrdersData() {
    setLoadingOrders(true)
    try {
      const [ordersData, driversData, productsData] = await Promise.all([
        getMyOrders(token),
        getUsers(token, { role: 'DRIVER' }),
        getProducts(),
      ])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setDrivers(Array.isArray(driversData) ? driversData : [])
      setProducts(Array.isArray(productsData) ? productsData : [])
      if (productsData?.length > 0 && !newOrderForm.productId) {
        setNewOrderForm((prev) => ({ ...prev, productId: productsData[0].id }))
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingOrders(false)
    }
  }

  // Load Users
  async function loadUsersData() {
    setLoadingUsers(true)
    try {
      const usersData = await getUsers(token, { includeInactive: true })
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Load System & Logs
  async function loadSystemData() {
    setLoadingSystem(true)
    try {
      const [statusData, logsData] = await Promise.all([
        getSystemStatus(token),
        getSystemLogs(token, { level: logFilter || undefined }),
      ])
      setSysStatus(statusData)
      setLogs(Array.isArray(logsData) ? logsData : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingSystem(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'orders') loadOrdersData()
    if (activeTab === 'users') loadUsersData()
    if (activeTab === 'system') loadSystemData()
  }, [token, activeTab, logFilter])

  // Order Actions
  async function handleAssignDriver(orderId, driverId) {
    try {
      await assignDriver(orderId, Number(driverId), token)
      showSuccess(`Pedido #${orderId} asignado al repartidor`)
      loadOrdersData()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleOrderStatus(orderId, status) {
    try {
      await changeOrderStatus(orderId, status, token)
      showSuccess(`Estado del pedido #${orderId} actualizado a ${STATUS_LABELS[status] || status}`)
      loadOrdersData()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleCreateOrder(e) {
    e.preventDefault()
    try {
      const selectedProd = products.find((p) => Number(p.id) === Number(newOrderForm.productId)) || products[0]
      if (!selectedProd) throw new Error('Seleccioná un producto válido')

      // Address handling: if admin creates order, use address 1 or create payload
      await createOrder(
        {
          addressId: 1,
          items: [{ productId: Number(selectedProd.id), quantity: Number(newOrderForm.quantity) }],
          paymentMethod: newOrderForm.paymentMethod,
          notes: newOrderForm.addressStreet ? `${newOrderForm.addressStreet}. ${newOrderForm.notes}` : newOrderForm.notes,
          driverId: newOrderForm.driverId ? Number(newOrderForm.driverId) : undefined,
        },
        token
      )
      setNewOrderModal(false)
      showSuccess('¡Pedido creado y despachado con éxito!')
      loadOrdersData()
    } catch (e) {
      setError(e.message)
    }
  }

  // User Actions
  async function handleCreateUser(e) {
    e.preventDefault()
    try {
      await createUser(newUserForm, token)
      setNewUserModal(false)
      setNewUserForm({ name: '', email: '', password: '', role: 'DRIVER', phone: '', vehicle: 'Furgón' })
      showSuccess(`Usuario ${newUserForm.name} creado correctamente`)
      loadUsersData()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleToggleUserActive(targetUser) {
    try {
      await updateUser(targetUser.id, { active: !targetUser.active }, token)
      showSuccess(`Usuario ${targetUser.name} ${targetUser.active ? 'desactivado' : 'activado'}`)
      loadUsersData()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleClearLogs() {
    if (!window.confirm('¿Seguro de reiniciar el historial de logs en memoria?')) return
    try {
      await clearSystemLogs(token)
      loadSystemData()
      showSuccess('Historial de logs reiniciado')
    } catch (e) {
      setError(e.message)
    }
  }

  const filteredOrders = orders.filter((o) => {
    if (!orderFilter) return true
    return o.status === orderFilter
  })

  return (
    <div className="page" style={{ maxWidth: 1120 }}>
      {/* Header Principal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>🛡️ Consola de Control & Dev</h1>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
              ADMIN
            </span>
          </div>
          <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
            Panel unificado de despacho, gestión de usuarios de la DB y monitor del sistema.
          </p>
        </div>

        {/* Botones de Acción Primaria */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activeTab === 'orders' && (
            <button className="btn btn-primary btn-sm" onClick={() => setNewOrderModal(true)}>
              ➕ Nuevo Pedido
            </button>
          )}
          {activeTab === 'users' && (
            <button className="btn btn-primary btn-sm" onClick={() => setNewUserModal(true)}>
              ➕ Crear Usuario
            </button>
          )}
          {activeTab === 'system' && (
            <button className="btn btn-outline btn-sm" onClick={loadSystemData} disabled={loadingSystem}>
              🔄 {loadingSystem ? 'Consultando…' : 'Refrescar DB & Logs'}
            </button>
          )}
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setError(null)}>✕</button>
        </div>
      )}
      {successMsg && (
        <div className="alert" style={{ background: '#eaf7ed', color: 'var(--success)', borderColor: 'var(--success)', marginBottom: '1rem' }}>
          {successMsg}
        </div>
      )}

      {/* Pestañas de Navegación de la Consola */}
      <div className="tabs" style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--border)' }}>
        <button
          className={`tabs__btn ${activeTab === 'orders' ? 'tabs__btn--active' : ''}`}
          style={{ fontSize: '0.95rem', fontWeight: 600, padding: '0.6rem 1.25rem' }}
          onClick={() => setActiveTab('orders')}
        >
          📦 Despacho de Pedidos ({orders.length})
        </button>
        <button
          className={`tabs__btn ${activeTab === 'users' ? 'tabs__btn--active' : ''}`}
          style={{ fontSize: '0.95rem', fontWeight: 600, padding: '0.6rem 1.25rem' }}
          onClick={() => setActiveTab('users')}
        >
          👥 Gestión de Usuarios
        </button>
        <button
          className={`tabs__btn ${activeTab === 'system' ? 'tabs__btn--active' : ''}`}
          style={{ fontSize: '0.95rem', fontWeight: 600, padding: '0.6rem 1.25rem' }}
          onClick={() => setActiveTab('system')}
        >
          ⚡ Base de Datos & Logs
        </button>
      </div>

      {/* ========================================================
          PESTAÑA 1: DESPACHO DE PEDIDOS
          ======================================================== */}
      {activeTab === 'orders' && (
        <div>
          {/* Métricas Rápidas */}
          <div className="grid grid--stats" style={{ marginBottom: '1.5rem' }}>
            <div className="card kpi">
              <div className="kpi__value">{orders.length}</div>
              <div className="kpi__label">Total Pedidos</div>
            </div>
            <div className="card kpi">
              <div className="kpi__value" style={{ color: 'var(--warning)' }}>
                {orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length}
              </div>
              <div className="kpi__label">Pendientes</div>
            </div>
            <div className="card kpi">
              <div className="kpi__value" style={{ color: 'var(--primary)' }}>
                {orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length}
              </div>
              <div className="kpi__label">En Reparto</div>
            </div>
            <div className="card kpi">
              <div className="kpi__value" style={{ color: 'var(--success)' }}>
                {orders.filter((o) => o.status === 'DELIVERED').length}
              </div>
              <div className="kpi__label">Entregados</div>
            </div>
          </div>

          {/* Filtros de Pedidos */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['', 'PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                className={`btn btn-sm ${orderFilter === st ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setOrderFilter(st)}
              >
                {st ? STATUS_LABELS[st] : 'Todos los Pedidos'}
              </button>
            ))}
          </div>

          {/* Tabla / Lista de Pedidos */}
          {loadingOrders ? (
            <p className="muted">Cargando pedidos…</p>
          ) : filteredOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="muted">No hay pedidos con el filtro seleccionado.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredOrders.map((o) => (
                <div key={o.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong>Pedido #{o.id}</strong> · <span className="muted">{new Date(o.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.05rem' }}>{o.customer_name} ({o.customer_phone || 'Sin tel.'})</h3>
                    </div>
                    <span className={`badge badge--${o.status}`}>{STATUS_LABELS[o.status] || o.status}</span>
                  </div>

                  <div style={{ background: 'var(--bg)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.88rem' }}>
                    <p style={{ margin: 0 }}>📍 <strong>{o.street}</strong> {o.city ? `(${o.city})` : ''}</p>
                    {o.notes && <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.8rem' }}>Nota: {o.notes}</p>}
                    {o.items && o.items.length > 0 && (
                      <p style={{ margin: '0.35rem 0 0', color: 'var(--primary-dark)', fontWeight: 600 }}>
                        💧 {o.items.map((it) => `${it.quantity}x ${it.productName || 'Bidón'}`).join(', ')}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <span className="muted" style={{ fontSize: '0.85rem' }}>Total: </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{fmtMoney(o.total)}</strong>
                      <span className="muted" style={{ fontSize: '0.8rem' }}> ({o.payment_method === 'CASH' ? 'Efectivo' : 'Transferencia'})</span>
                    </div>

                    {/* Asignación de Repartidor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600 }} className="muted">Repartidor:</label>
                      <select
                        className="input"
                        style={{ height: '34px', padding: '0.2rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                        value={o.driver_id || ''}
                        onChange={(e) => handleAssignDriver(o.id, e.target.value)}
                      >
                        <option value="">-- Sin Asignar --</option>
                        {drivers.map((d) => (
                          <option key={d.driver_id || d.id} value={d.driver_id || d.id}>
                            🚚 {d.name} ({d.vehicle || 'Repartidor'})
                          </option>
                        ))}
                      </select>

                      {/* Botón de Cambio de Estado Rápido */}
                      {o.status === 'PENDING' && (
                        <button className="btn btn-outline btn-sm" onClick={() => handleOrderStatus(o.id, 'OUT_FOR_DELIVERY')}>
                          🚀 Despachar
                        </button>
                      )}
                      {o.status === 'OUT_FOR_DELIVERY' && (
                        <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => handleOrderStatus(o.id, 'DELIVERED')}>
                          ✅ Entregado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PESTAÑA 2: GESTIÓN DE USUARIOS
          ======================================================== */}
      {activeTab === 'users' && (
        <div>
          {loadingUsers ? (
            <p className="muted">Cargando usuarios de la base de datos…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>Usuario</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>Email</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>Rol en DB</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>Teléfono / Datos</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>Estado</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const badge = ROLE_BADGES[u.role] || ROLE_BADGES.CLIENT
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <strong>{u.name}</strong>
                          {u.id === currentUser?.id && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '0.4rem' }}>(Tú)</span>}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.email}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ background: badge.bg, color: badge.text, padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                          {u.phone || '—'} {u.vehicle ? `· 🚗 ${u.vehicle}` : ''}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ color: u.active ? 'var(--success)' : 'var(--danger)', fontWeight: 600, fontSize: '0.82rem' }}>
                            {u.active ? '● Activo' : '○ Inactivo'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          {u.id !== currentUser?.id && (
                            <button
                              className={`btn btn-sm ${u.active ? 'btn-ghost' : 'btn-outline'}`}
                              style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem' }}
                              onClick={() => handleToggleUserActive(u)}
                            >
                              {u.active ? 'Desactivar' : 'Activar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PESTAÑA 3: MONITOR DE BASE DE DATOS Y LOGS
          ======================================================== */}
      {activeTab === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Banner de Estado de Conexión a Supabase */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: sysStatus?.database?.connected ? '6px solid var(--success)' : '6px solid var(--danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>ESTADO DE BASE DE DATOS</span>
                <h2 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {sysStatus?.database?.connected ? '🟢 Conexión Activa con Supabase' : '🔴 Sin Conexión a Base de Datos'}
                </h2>
                <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  Base de Datos: <strong>{sysStatus?.database?.database || 'postgres'}</strong> · Latencia: <strong>{sysStatus?.database?.latencyMs} ms</strong>
                </p>
                {sysStatus?.database?.version && (
                  <p className="muted" style={{ margin: '0.1rem 0 0', fontSize: '0.78rem' }}>{sysStatus?.database?.version}</p>
                )}
              </div>
              <span className="badge" style={{ background: '#eaf7ed', color: 'var(--success)' }}>
                PostgreSQL OK
              </span>
            </div>

            {/* Contadores de Tablas */}
            {sysStatus?.database?.tables && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
                <div style={{ background: 'var(--bg)', padding: '0.65rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{sysStatus.database.tables.users}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Usuarios</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.65rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{sysStatus.database.tables.deliveryDrivers}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Repartidores</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.65rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{sysStatus.database.tables.orders}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Pedidos</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.65rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{sysStatus.database.tables.products}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Productos</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.65rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{sysStatus.database.tables.deliveryZones}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Zonas</div>
                </div>
              </div>
            )}
          </div>

          {/* Visor de Logs del Sistema */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📜 Registro de Eventos & Logs de la API</h3>
                <p className="muted" style={{ margin: '0.15rem 0 0', fontSize: '0.8rem' }}>Últimas acciones y eventos de auditoría en memoria</p>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <select
                  className="input"
                  style={{ height: '32px', padding: '0.1rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                >
                  <option value="">Todos los niveles</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }} onClick={handleClearLogs}>
                  Limpiar
                </button>
              </div>
            </div>

            {logs.length === 0 ? (
              <p className="muted" style={{ fontSize: '0.85rem' }}>No hay registros de log recientes.</p>
            ) : (
              <div style={{ background: '#1c2733', color: '#e0f2fe', borderRadius: '8px', padding: '0.75rem 1rem', maxHeight: '340px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                {logs.map((l) => (
                  <div key={l.id} style={{ padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.6rem' }}>
                    <span style={{ color: '#94a3b8' }}>{new Date(l.timestamp).toLocaleTimeString()}</span>
                    <span style={{
                      fontWeight: 700,
                      color: l.level === 'ERROR' ? '#f87171' : l.level === 'WARN' ? '#fbbf24' : '#38bdf8',
                    }}>
                      [{l.level}]
                    </span>
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{l.action}</span>
                    <span style={{ color: '#94a3b8', flex: 1, wordBreak: 'break-all' }}>{JSON.stringify(l.details)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear Pedido */}
      {newOrderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: '1.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.3rem', marginTop: 0 }}>➕ Crear y Despachar Pedido</h2>
            <form onSubmit={handleCreateOrder}>
              <div className="form-group">
                <label className="form-label">Dirección de Entrega:</label>
                <input
                  className="input"
                  required
                  placeholder="ej: Av. San Martín 1234, Dpto 2B"
                  value={newOrderForm.addressStreet}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, addressStreet: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Producto:</label>
                  <select
                    className="input"
                    value={newOrderForm.productId}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, productId: e.target.value })}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({fmtMoney(p.price)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cantidad:</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={newOrderForm.quantity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Asignar a Repartidor:</label>
                <select
                  className="input"
                  value={newOrderForm.driverId}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, driverId: e.target.value })}
                >
                  <option value="">-- Dejar sin asignar --</option>
                  {drivers.map((d) => (
                    <option key={d.driver_id || d.id} value={d.driver_id || d.id}>
                      🚚 {d.name} ({d.vehicle || 'Repartidor'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Método de Pago:</label>
                <select
                  className="input"
                  value={newOrderForm.paymentMethod}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                >
                  <option value="CASH">Efectivo al recibir</option>
                  <option value="TRANSFER">Transferencia bancaria</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notas adicionales:</label>
                <input
                  className="input"
                  placeholder="ej: Tocar timbre blanco, dejar en recepción"
                  value={newOrderForm.notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-ghost btn-block" onClick={() => setNewOrderModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-block">
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crear Usuario */}
      {newUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 460, width: '100%', padding: '1.5rem', background: '#fff' }}>
            <h2 style={{ fontSize: '1.3rem', marginTop: 0 }}>➕ Crear Nuevo Usuario en la DB</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label className="form-label">Nombre Completo:</label>
                <input
                  className="input"
                  required
                  placeholder="ej: Carlos Repartidor"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico:</label>
                <input
                  className="input"
                  type="email"
                  required
                  placeholder="ej: carlos@agua.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña inicial:</label>
                <input
                  className="input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rol del Usuario:</label>
                <select
                  className="input"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                >
                  <option value="DRIVER">🚚 Repartidor</option>
                  <option value="ADMIN">👑 Administrador / Dev</option>
                  <option value="CLIENT">👤 Cliente</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono (WhatsApp):</label>
                <input
                  className="input"
                  placeholder="ej: +5491112345678"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                />
              </div>

              {newUserForm.role === 'DRIVER' && (
                <div className="form-group">
                  <label className="form-label">Vehículo / Zona:</label>
                  <input
                    className="input"
                    placeholder="ej: Camioneta Renault Kangoo"
                    value={newUserForm.vehicle}
                    onChange={(e) => setNewUserForm({ ...newUserForm, vehicle: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-ghost btn-block" onClick={() => setNewUserModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-block">
                  Guardar en DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
