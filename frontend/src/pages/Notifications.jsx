import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notifications.js'

export default function Notifications() {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState(null)

  function load() {
    getNotifications(token)
      .then((data) => setNotifications(data.notifications))
      .catch((e) => setError(e.message))
  }

  useEffect(load, [token])

  function handleRead(id) {
    markNotificationRead(id, token).then(load).catch((e) => setError(e.message))
  }

  function handleReadAll() {
    markAllNotificationsRead(token).then(load).catch((e) => setError(e.message))
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Notificaciones</h1>
        {notifications.some((n) => !n.read) && (
          <button className="btn btn-outline btn-sm" onClick={handleReadAll}>Marcar todas como leídas</button>
        )}
      </div>
      {error && <p className="alert alert--error">{error}</p>}
      {notifications.length === 0 && !error && <p className="muted">No tenés notificaciones.</p>}
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => !n.read && handleRead(n.id)}
          className={`card card--flat ${n.read ? '' : 'card--unread'}`}
          style={{ cursor: n.read ? 'default' : 'pointer', borderLeft: n.read ? undefined : '4px solid var(--primary)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            <strong>{n.title}</strong>
            <span className="muted text-sm">{new Date(n.created_at).toLocaleString('es-AR')}</span>
          </div>
          <p className="muted" style={{ margin: '0.3rem 0 0' }}>{n.message}</p>
        </div>
      ))}
    </div>
  )
}
