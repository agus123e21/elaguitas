import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getMyOrders, changeOrderStatus, assignDriver, createOrder } from '../../services/orders.js'
import { getUsers, createUser, updateUser } from '../../services/users.js'
import { getSystemStatus, getSystemLogs, clearSystemLogs } from '../../services/system.js'
import { getProducts } from '../../services/products.js'
import {
  ShieldIcon,
  TruckIcon,
  UserIcon,
  PlusIcon,
  RefreshCwIcon,
  PackageIcon,
  CheckIcon,
  MapPinIcon,
  ClockIcon,
  AlertCircleIcon,
  DollarSignIcon,
  SlidersIcon,
} from '../../components/Icons.jsx'

const fmtMoney = (n) => `$${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'En Camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const ROLE_BADGES = {
  ADMIN: { label: 'Admin / Dirección', bg: '#fef3c7', text: '#92400e' },
  DRIVER: { label: 'Repartidor', bg: '#e0f2fe', text: '#0369a1' },
  CLIENT: { label: 'Cliente', bg: '#f1f5f9', text: '#334155' },
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
    vehicle: 'Reparto',
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
      showSuccess('Pedido creado y despachado con éxito')
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
      setNewUserForm({ name: '', email: '', password: '', role: 'DRIVER', phone: '', vehicle: 'Reparto' })
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
    <div className="page" style={{ maxWidth: 880, margin: '0 auto', paddingBottom: '7rem' }}>
      {/* Header Consola */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Panel de Control
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPinIcon size={13} /> San Rafael
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', margin: '0.1rem 0 0', fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldIcon size={26} color="var(--primary)" />
              <span>Consola Administrativa</span>
            </h1>
          </div>

          {/* Botones de Acción */}
          {activeTab === 'orders' && (
            <button
              className="btn btn-primary"
              style={{
                minHeight: '44px',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(11, 125, 194, 0.25)',
              }}
              onClick={() => setNewOrderModal(true)}
            >
              <PlusIcon size={16} color="#ffffff" />
              <span>Nuevo Pedido</span>
            </button>
          )}
          {activeTab === 'users' && (
            <button
              className="btn btn-primary"
              style={{
                minHeight: '44px',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(11, 125, 194, 0.25)',
              }}
              onClick={() => setNewUserModal(true)}
            >
              <PlusIcon size={16} color="#ffffff" />
              <span>Crear Usuario</span>
            </button>
          )}
          {activeTab === 'system' && (
            <button
              className="btn btn-outline"
              onClick={loadSystemData}
              disabled={loadingSystem}
              style={{
                borderRadius: '9999px',
                minHeight: '42px',
                padding: '0.4rem 1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 800,
                fontSize: '0.82rem',
                background: '#ffffff',
              }}
            >
              <RefreshCwIcon size={14} />
              <span>{loadingSystem ? 'Consultando…' : 'Refrescar'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem', borderRadius: '18px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </span>
        </div>
      )}
      {successMsg && (
        <div className="alert alert--success" style={{ marginBottom: '1.25rem', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <CheckIcon size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pestañas de Control en Cápsulas */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem',
          scrollbarWidth: 'none',
        }}
      >
        {[
          { key: 'orders', label: `Despacho (${orders.length})`, icon: PackageIcon },
          { key: 'users', label: `Usuarios (${users.length})`, icon: UserIcon },
          { key: 'system', label: 'Monitor Supabase', icon: ShieldIcon },
        ].map((tab) => {
          const isActive = activeTab === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                background: isActive ? 'var(--primary)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--text)',
                boxShadow: isActive ? '0 6px 18px rgba(11, 125, 194, 0.25)' : 'var(--shadow-soft)',
              }}
            >
              <Icon size={17} color={isActive ? '#ffffff' : 'var(--primary)'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ========================================================
          PESTAÑA 1: DESPACHO DE PEDIDOS
          ======================================================== */}
      {activeTab === 'orders' && (
        <div>
          {/* Métricas Rápidas en Cuadrícula Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="card" style={{ padding: '1rem', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text)' }}>{orders.length}</div>
              <div className="muted" style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Pedidos</div>
            </div>
            <div className="card" style={{ padding: '1rem', borderRadius: '20px', border: '1px solid #fef08a', background: '#fffdf5', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#b45309' }}>
                {orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length}
              </div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: '#b45309' }}>Pendientes</div>
            </div>
            <div className="card" style={{ padding: '1rem', borderRadius: '20px', border: '1px solid #bae6fd', background: '#f0f9ff', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>
                {orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length}
              </div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>En Reparto</div>
            </div>
            <div className="card" style={{ padding: '1rem', borderRadius: '20px', border: '1px solid #bbf7d0', background: '#f0fdf4', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success)' }}>
                {orders.filter((o) => o.status === 'DELIVERED').length}
              </div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--success)' }}>Entregados</div>
            </div>
          </div>

          {/* Filtros de Estado en Cápsula */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
            {['', 'PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => {
              const isSelected = orderFilter === st
              return (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: isSelected ? 'var(--primary-dark)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--muted)',
                    boxShadow: isSelected ? '0 4px 12px rgba(7, 90, 140, 0.25)' : 'none',
                    border: isSelected ? 'none' : '1px solid #e2e8f0',
                  }}
                >
                  {st ? STATUS_LABELS[st] : 'Todos'}
                </button>
              )
            })}
          </div>

          {/* Lista de Pedidos */}
          {loadingOrders ? (
            <p className="muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Cargando pedidos de San Rafael…</p>
          ) : filteredOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', borderRadius: '24px' }}>
              <p className="muted" style={{ margin: 0 }}>No hay pedidos registrados con el filtro seleccionado.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredOrders.map((o) => (
                <div
                  key={o.id}
                  className="card"
                  style={{
                    padding: '1.4rem',
                    borderRadius: '26px',
                    border: '1px solid rgba(11, 125, 194, 0.12)',
                    boxShadow: 'var(--shadow-soft)',
                    background: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em' }}>ORDEN #{o.id}</span>
                      <h3 style={{ margin: '0.1rem 0 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text)' }}>{o.customer_name}</h3>
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        background: o.status === 'DELIVERED' ? '#ecfdf5' : o.status === 'OUT_FOR_DELIVERY' ? 'var(--primary-light)' : '#fef3c7',
                        color: o.status === 'DELIVERED' ? 'var(--success)' : o.status === 'OUT_FOR_DELIVERY' ? 'var(--primary)' : '#92400e',
                      }}
                    >
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '18px', fontSize: '0.88rem', marginBottom: '0.85rem', border: '1px solid #f1f5f9' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>{o.street} {o.city ? `(${o.city})` : ''}</p>
                    {o.notes && <p className="muted" style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Nota: {o.notes}</p>}
                    {o.items && o.items.length > 0 && (
                      <p style={{ margin: '0.4rem 0 0', color: 'var(--primary)', fontWeight: 800 }}>
                        {o.items.map((it) => `${it.quantity}x ${it.productName || 'Bidón'}`).join(', ')}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                    <div>
                      <span className="muted" style={{ fontSize: '0.82rem' }}>Total: </span>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtMoney(o.total)}
                      </strong>
                    </div>

                    {/* Selector de Repartidor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <select
                        className="select"
                        style={{ minHeight: '38px', padding: '0.2rem 0.8rem', fontSize: '0.84rem', width: 'auto', borderRadius: '9999px' }}
                        value={o.driver_id || ''}
                        onChange={(e) => handleAssignDriver(o.id, e.target.value)}
                      >
                        <option value="">-- Sin Asignar --</option>
                        {drivers.map((d) => (
                          <option key={d.driver_id || d.id} value={d.driver_id || d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Acciones de Estado */}
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    {o.status === 'PENDING' && (
                      <button
                        className="btn btn-primary btn-block"
                        style={{ borderRadius: '9999px', minHeight: '44px', fontWeight: 800 }}
                        onClick={() => handleOrderStatus(o.id, 'OUT_FOR_DELIVERY')}
                      >
                        Despachar a Reparto
                      </button>
                    )}
                    {o.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        className="btn btn-success btn-block"
                        style={{ borderRadius: '9999px', minHeight: '44px', fontWeight: 800 }}
                        onClick={() => handleOrderStatus(o.id, 'DELIVERED')}
                      >
                        Marcar Entregado
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
            <p className="muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Cargando usuarios…</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {users.map((u) => {
                const badge = ROLE_BADGES[u.role] || ROLE_BADGES.CLIENT
                return (
                  <div
                    key={u.id}
                    className="card"
                    style={{
                      padding: '1.15rem 1.35rem',
                      borderRadius: '24px',
                      border: '1px solid rgba(11, 125, 194, 0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      background: '#ffffff',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{u.name}</strong>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.text,
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.84rem' }}>
                        {u.email} {u.phone ? `· Tel: ${u.phone}` : ''}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: u.active ? 'var(--success)' : 'var(--danger)', fontWeight: 800, fontSize: '0.8rem' }}>
                        {u.active ? '● Activo' : '○ Inactivo'}
                      </span>
                      {u.id !== currentUser?.id && (
                        <button
                          className={`btn btn-sm ${u.active ? 'btn-ghost' : 'btn-outline'}`}
                          style={{ minHeight: '36px', fontSize: '0.78rem', borderRadius: '9999px', padding: '0.3rem 0.85rem' }}
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
          PESTAÑA 3: MONITOR DE BASE DE DATOS Y LOGS (100% LIGHT MODE)
          ======================================================== */}
      {activeTab === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tarjeta de Estado de Supabase */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '28px',
              border: sysStatus?.database?.connected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              background: '#ffffff',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Estado de Supabase</span>
                <h2 style={{ fontSize: '1.35rem', margin: '0.2rem 0 0', fontWeight: 900, color: 'var(--text)' }}>
                  {sysStatus?.database?.connected ? 'Conexión Activa y Operativa' : 'Desconectado'}
                </h2>
                <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
                  Base: <strong>{sysStatus?.database?.database || 'postgres'}</strong> · Latencia de consulta: <strong>{sysStatus?.database?.latencyMs} ms</strong>
                </p>
              </div>
              <span
                style={{
                  background: '#ecfdf5',
                  color: 'var(--success)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                }}
              >
                PostgreSQL Pooler OK
              </span>
            </div>

            {sysStatus?.database?.tables && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.65rem', marginTop: '1.25rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '18px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>{sysStatus.database.tables.users}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700 }}>Usuarios</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '18px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>{sysStatus.database.tables.deliveryDrivers}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700 }}>Repartidores</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '18px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>{sysStatus.database.tables.orders}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700 }}>Pedidos</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '18px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>{sysStatus.database.tables.products}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700 }}>Productos</div>
                </div>
              </div>
            )}
          </div>

          {/* Visor de Logs 100% Modo Claro */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '28px',
              border: '1px solid rgba(11, 125, 194, 0.12)',
              background: '#ffffff',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)' }}>Eventos de API en Vivo</h3>
                <p className="muted" style={{ margin: '0.15rem 0 0', fontSize: '0.8rem' }}>Auditoría en memoria y trazabilidad</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className="select"
                  style={{ minHeight: '36px', padding: '0.1rem 0.75rem', fontSize: '0.8rem', width: 'auto', borderRadius: '9999px' }}
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                >
                  <option value="">Todos los niveles</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
                <button
                  className="btn btn-outline"
                  onClick={handleClearLogs}
                  style={{ minHeight: '36px', fontSize: '0.8rem', borderRadius: '9999px', padding: '0.2rem 0.85rem' }}
                >
                  Limpiar
                </button>
              </div>
            </div>

            {logs.length === 0 ? (
              <p className="muted" style={{ fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem 0' }}>Sin logs recientes registrados.</p>
            ) : (
              <div
                style={{
                  background: '#f8fafc',
                  color: '#1e293b',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                }}
              >
                {logs.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      padding: '0.35rem 0',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      gap: '0.65rem',
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ color: '#64748b', fontSize: '0.74rem' }}>{new Date(l.timestamp).toLocaleTimeString()}</span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '6px',
                        background: l.level === 'ERROR' ? '#fee2e2' : l.level === 'WARN' ? '#fef3c7' : '#e0f2fe',
                        color: l.level === 'ERROR' ? '#b91c1c' : l.level === 'WARN' ? '#b45309' : '#0369a1',
                      }}
                    >
                      {l.level}
                    </span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{l.action}</span>
                    <span style={{ color: '#64748b', flex: 1, wordBreak: 'break-all' }}>{JSON.stringify(l.details)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Mobile Bottom Sheet: Crear Pedido */}
      {newOrderModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 540,
              width: '100%',
              padding: '1.75rem',
              background: '#fff',
              borderRadius: '36px 36px 0 0',
              margin: 0,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ width: '48px', height: '5px', background: '#e2e8f0', borderRadius: '9999px', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.45rem', marginTop: 0, fontWeight: 900, color: 'var(--text)' }}>Crear y Despachar Pedido</h2>
            <form onSubmit={handleCreateOrder} className="form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Dirección en San Rafael:</label>
                <input
                  className="input"
                  required
                  placeholder="ej: Av. Balloffet 1250"
                  value={newOrderForm.addressStreet}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, addressStreet: e.target.value })}
                  style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>Producto:</label>
                  <select
                    className="select"
                    value={newOrderForm.productId}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, productId: e.target.value })}
                    style={{ borderRadius: '16px', minHeight: '46px' }}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({fmtMoney(p.price)})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>Cantidad:</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={newOrderForm.quantity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value) })}
                    style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Asignar Repartidor:</label>
                <select
                  className="select"
                  value={newOrderForm.driverId}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, driverId: e.target.value })}
                  style={{ borderRadius: '16px', minHeight: '46px' }}
                >
                  <option value="">-- Sin Asignar --</option>
                  {drivers.map((d) => (
                    <option key={d.driver_id || d.id} value={d.driver_id || d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Método de Pago:</label>
                <select
                  className="select"
                  value={newOrderForm.paymentMethod}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                  style={{ borderRadius: '16px', minHeight: '46px' }}
                >
                  <option value="CASH">Efectivo al recibir en mano</option>
                  <option value="TRANSFER">Transferencia QR</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Instrucción especial:</label>
                <input
                  className="input"
                  placeholder="ej: Timbre blanco, dejar con portería"
                  value={newOrderForm.notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                  style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ minHeight: '50px', borderRadius: '9999px', fontWeight: 800 }}
                  onClick={() => setNewOrderModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ minHeight: '50px', borderRadius: '9999px', fontWeight: 900 }}
                >
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Mobile Bottom Sheet: Crear Usuario */}
      {newUserModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 540,
              width: '100%',
              padding: '1.75rem',
              background: '#fff',
              borderRadius: '36px 36px 0 0',
              margin: 0,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ width: '48px', height: '5px', background: '#e2e8f0', borderRadius: '9999px', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.45rem', marginTop: 0, fontWeight: 900, color: 'var(--text)' }}>Crear Usuario</h2>
            <form onSubmit={handleCreateUser} className="form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Nombre Completo:</label>
                <input
                  className="input"
                  required
                  placeholder="ej: Marcos Repartidor"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Correo Electrónico:</label>
                <input
                  className="input"
                  type="email"
                  required
                  placeholder="ej: marcos@agua.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Contraseña Inicial:</label>
                <input
                  className="input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Rol del Usuario:</label>
                <select
                  className="select"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  style={{ borderRadius: '16px', minHeight: '46px' }}
                >
                  <option value="DRIVER">Repartidor</option>
                  <option value="ADMIN">Administrador / Dirección</option>
                  <option value="CLIENT">Cliente</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Teléfono (WhatsApp):</label>
                <input
                  className="input"
                  placeholder="ej: +54 9 2604 12-3456"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  style={{ borderRadius: '16px', padding: '0.85rem 1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ minHeight: '50px', borderRadius: '9999px', fontWeight: 800 }}
                  onClick={() => setNewUserModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ minHeight: '50px', borderRadius: '9999px', fontWeight: 900 }}
                >
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
