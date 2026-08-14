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
    addressStreet: '',
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
    <div className="page" style={{ maxWidth: 840 }}>
      {/* Header Mobile First */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h1 style={{ fontSize: '1.6rem', margin: 0 }}>🛡️ Consola de Control</h1>
              <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', fontSize: '0.72rem', fontWeight: 800 }}>
                ADMIN
              </span>
            </div>
            <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
              Gestión operativa de pedidos, usuarios y base de datos.
            </p>
          </div>

          {/* Botón de Acción Principal en la parte superior */}
          {activeTab === 'orders' && (
            <button className="btn btn-primary" style={{ minHeight: '44px' }} onClick={() => setNewOrderModal(true)}>
              ➕ Nuevo Pedido
            </button>
          )}
          {activeTab === 'users' && (
            <button className="btn btn-primary" style={{ minHeight: '44px' }} onClick={() => setNewUserModal(true)}>
              ➕ Crear Usuario
            </button>
          )}
          {activeTab === 'system' && (
            <button className="btn btn-outline btn-sm" onClick={loadSystemData} disabled={loadingSystem}>
              🔄 {loadingSystem ? 'Consultando…' : 'Refrescar'}
            </button>
          )}
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
          <span>⚠️ {error}</span>
        </div>
      )}
      {successMsg && (
        <div className="alert alert--success" style={{ marginBottom: '1rem' }}>
          <span>✅ {successMsg}</span>
        </div>
      )}

      {/* Segmented Control / Tabs Táctiles */}
      <div className="tabs" style={{ marginBottom: '1.25rem' }}>
        <button
          className={`tabs__btn ${activeTab === 'orders' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Despacho ({orders.length})
        </button>
        <button
          className={`tabs__btn ${activeTab === 'users' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios ({users.length})
        </button>
        <button
          className={`tabs__btn ${activeTab === 'system' ? 'tabs__btn--active' : ''}`}
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
          {/* Métricas Rápidas en Cuadrícula Mobile */}
          <div className="grid grid--stats" style={{ marginBottom: '1.25rem' }}>
            <div className="kpi">
              <div className="kpi__value">{orders.length}</div>
              <div className="kpi__label">Total Pedidos</div>
            </div>
            <div className="kpi">
              <div className="kpi__value" style={{ color: 'var(--warning)' }}>
                {orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length}
              </div>
              <div className="kpi__label">Pendientes</div>
            </div>
            <div className="kpi">
              <div className="kpi__value" style={{ color: 'var(--primary)' }}>
                {orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length}
              </div>
              <div className="kpi__label">En Reparto</div>
            </div>
            <div className="kpi">
              <div className="kpi__value" style={{ color: 'var(--success)' }}>
                {orders.filter((o) => o.status === 'DELIVERED').length}
              </div>
              <div className="kpi__label">Entregados</div>
            </div>
          </div>

          {/* Filtros de Estado */}
          <div className="tabs" style={{ marginBottom: '1rem' }}>
            {['', 'PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                className={`tabs__btn ${orderFilter === st ? 'tabs__btn--active' : ''}`}
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                onClick={() => setOrderFilter(st)}
              >
                {st ? STATUS_LABELS[st] : 'Todos'}
              </button>
            ))}
          </div>

          {/* Lista de Pedidos */}
          {loadingOrders ? (
            <p className="muted">Cargando pedidos…</p>
          ) : filteredOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <p className="muted" style={{ margin: 0 }}>No hay pedidos con el filtro seleccionado.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredOrders.map((o) => (
                <div key={o.id} className="card" style={{ padding: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)' }}>ORDEN #{o.id}</span>
                      <h3 style={{ margin: '0.1rem 0 0', fontSize: '1.15rem' }}>{o.customer_name}</h3>
                    </div>
                    <span className={`badge badge--${o.status}`}>{STATUS_LABELS[o.status] || o.status}</span>
                  </div>

                  <div style={{ background: 'var(--bg)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>📍 {o.street} {o.city ? `(${o.city})` : ''}</p>
                    {o.notes && <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.8rem' }}>Nota: {o.notes}</p>}
                    {o.items && o.items.length > 0 && (
                      <p style={{ margin: '0.35rem 0 0', color: 'var(--primary-dark)', fontWeight: 700 }}>
                        💧 {o.items.map((it) => `${it.quantity}x ${it.productName || 'Bidón'}`).join(', ')}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span className="muted" style={{ fontSize: '0.82rem' }}>Total: </span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtMoney(o.total)}
                      </strong>
                    </div>

                    {/* Selector de Repartidor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <select
                        className="select"
                        style={{ minHeight: '38px', padding: '0.2rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                        value={o.driver_id || ''}
                        onChange={(e) => handleAssignDriver(o.id, e.target.value)}
                      >
                        <option value="">-- Sin Asignar --</option>
                        {drivers.map((d) => (
                          <option key={d.driver_id || d.id} value={d.driver_id || d.id}>
                            🚚 {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Acciones de Estado */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {o.status === 'PENDING' && (
                      <button className="btn btn-primary btn-block btn-sm" onClick={() => handleOrderStatus(o.id, 'OUT_FOR_DELIVERY')}>
                        🚀 Despachar (A Reparto)
                      </button>
                    )}
                    {o.status === 'OUT_FOR_DELIVERY' && (
                      <button className="btn btn-success btn-block btn-sm" onClick={() => handleOrderStatus(o.id, 'DELIVERED')}>
                        ✅ Marcar Entregado
                      </button>
                    )}
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
            <p className="muted">Cargando usuarios…</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map((u) => {
                const badge = ROLE_BADGES[u.role] || ROLE_BADGES.CLIENT
                return (
                  <div key={u.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '1.05rem' }}>{u.name}</strong>
                        <span style={{ background: badge.bg, color: badge.text, padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="muted" style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {u.email} {u.phone ? `· 📞 ${u.phone}` : ''}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: u.active ? 'var(--success)' : 'var(--danger)', fontWeight: 600, fontSize: '0.8rem' }}>
                        {u.active ? '● Activo' : '○ Inactivo'}
                      </span>
                      {u.id !== currentUser?.id && (
                        <button
                          className={`btn btn-sm ${u.active ? 'btn-ghost' : 'btn-outline'}`}
                          style={{ minHeight: '34px', fontSize: '0.78rem' }}
                          onClick={() => handleToggleUserActive(u)}
                        >
                          {u.active ? 'Desactivar' : 'Activar'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PESTAÑA 3: MONITOR DE BASE DE DATOS Y LOGS
          ======================================================== */}
      {activeTab === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tarjeta de Estado de Supabase */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: sysStatus?.database?.connected ? '6px solid var(--success)' : '6px solid var(--danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>ESTADO SUPABASE</span>
                <h2 style={{ fontSize: '1.3rem', margin: '0.2rem 0 0' }}>
                  {sysStatus?.database?.connected ? '🟢 Conexión Activa' : '🔴 Desconectado'}
                </h2>
                <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
                  Base: <strong>{sysStatus?.database?.database || 'postgres'}</strong> · Latencia: <strong>{sysStatus?.database?.latencyMs} ms</strong>
                </p>
              </div>
              <span className="badge badge--success">PostgreSQL OK</span>
            </div>

            {sysStatus?.database?.tables && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{ background: 'var(--bg)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{sysStatus.database.tables.users}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Usuarios</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{sysStatus.database.tables.deliveryDrivers}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Repartidores</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{sysStatus.database.tables.orders}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Pedidos</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{sysStatus.database.tables.products}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Productos</div>
                </div>
              </div>
            )}
          </div>

          {/* Visor de Logs */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>📜 Eventos de API en Vivo</h3>
                <p className="muted" style={{ margin: '0.1rem 0 0', fontSize: '0.78rem' }}>Auditoría en memoria</p>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <select
                  className="select"
                  style={{ minHeight: '34px', padding: '0.1rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
                <button className="btn btn-ghost btn-sm" onClick={handleClearLogs} style={{ minHeight: '34px', fontSize: '0.78rem' }}>
                  Limpiar
                </button>
              </div>
            </div>

            {logs.length === 0 ? (
              <p className="muted" style={{ fontSize: '0.85rem' }}>Sin logs recientes.</p>
            ) : (
              <div style={{ background: '#0f172a', color: '#e0f2fe', borderRadius: 'var(--radius-sm)', padding: '0.75rem', maxHeight: '280px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {logs.map((l) => (
                  <div key={l.id} style={{ padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>{new Date(l.timestamp).toLocaleTimeString()}</span>
                    <span style={{ fontWeight: 700, color: l.level === 'ERROR' ? '#f87171' : l.level === 'WARN' ? '#fbbf24' : '#38bdf8' }}>
                      [{l.level}]
                    </span>
                    <span style={{ color: '#f8fafc' }}>{l.action}</span>
                    <span style={{ color: '#94a3b8', flex: 1, wordBreak: 'break-all' }}>{JSON.stringify(l.details)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Mobile Bottom Sheet: Crear Pedido */}
      {newOrderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', padding: '1.5rem', background: '#fff', borderRadius: '24px 24px 0 0', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 1.25rem' }} />
            <h2 style={{ fontSize: '1.3rem', marginTop: 0 }}>➕ Crear y Despachar Pedido</h2>
            <form onSubmit={handleCreateOrder} className="form">
              <div className="form-group">
                <label className="form-label">Dirección de Entrega:</label>
                <input
                  className="input"
                  required
                  placeholder="ej: Av. Corrientes 1234"
                  value={newOrderForm.addressStreet}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, addressStreet: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Producto:</label>
                  <select
                    className="select"
                    value={newOrderForm.productId}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, productId: e.target.value })}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({fmtMoney(p.price)})</option>
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
                <label className="form-label">Asignar Repartidor:</label>
                <select
                  className="select"
                  value={newOrderForm.driverId}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, driverId: e.target.value })}
                >
                  <option value="">-- Sin Asignar --</option>
                  {drivers.map((d) => (
                    <option key={d.driver_id || d.id} value={d.driver_id || d.id}>🚚 {d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Método de Pago:</label>
                <select
                  className="select"
                  value={newOrderForm.paymentMethod}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                >
                  <option value="CASH">Efectivo al recibir</option>
                  <option value="TRANSFER">Transferencia</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notas:</label>
                <input
                  className="input"
                  placeholder="ej: Timbre blanco"
                  value={newOrderForm.notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-ghost" style={{ minHeight: '48px' }} onClick={() => setNewOrderModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ minHeight: '48px', fontWeight: 700 }}>
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Mobile Bottom Sheet: Crear Usuario */}
      {newUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', padding: '1.5rem', background: '#fff', borderRadius: '24px 24px 0 0', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 1.25rem' }} />
            <h2 style={{ fontSize: '1.3rem', marginTop: 0 }}>➕ Crear Usuario en Supabase</h2>
            <form onSubmit={handleCreateUser} className="form">
              <div className="form-group">
                <label className="form-label">Nombre Completo:</label>
                <input
                  className="input"
                  required
                  placeholder="ej: Marcos Repartidor"
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
                  placeholder="ej: marcos@agua.com"
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
                  className="select"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-ghost" style={{ minHeight: '48px' }} onClick={() => setNewUserModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ minHeight: '48px', fontWeight: 700 }}>
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
