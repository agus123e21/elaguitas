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
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notificaciones</h1>
        {notifications.some((n) => !n.read) && <button onClick={handleReadAll}>Marcar todas como leídas</button>}
      </div>
      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {notifications.length === 0 && !error && <p>No tenés notificaciones.</p>}
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => !n.read && handleRead(n.id)}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            marginBottom: '0.5rem',
            cursor: n.read ? 'default' : 'pointer',
            background: n.read ? '#fafafa' : '#eef4ff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            <strong>{n.title}</strong>
            <span style={{ fontSize: '0.8rem', color: '#777' }}>{new Date(n.created_at).toLocaleString('es-AR')}</span>
          </div>
          <p style={{ margin: '0.3rem 0 0', color: '#555' }}>{n.message}</p>
        </div>
      ))}
    </main>
  )
}
