import { useState, useEffect } from 'react'
import { WifiOffIcon, CheckIcon } from './Icons.jsx'

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showRestored, setShowRestored] = useState(false)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      setShowRestored(true)
      const timer = setTimeout(() => setShowRestored(false), 3000)
      return () => clearTimeout(timer)
    }

    function handleOffline() {
      setIsOnline(false)
      setShowRestored(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline && !showRestored) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '60px',
        left: '1rem',
        right: '1rem',
        maxWidth: '440px',
        margin: '0 auto',
        zIndex: 9999,
        background: isOnline ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
        color: '#ffffff',
        padding: '0.6rem 1.15rem',
        borderRadius: '9999px',
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.82rem',
        fontWeight: 700,
        animation: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {isOnline ? (
        <>
          <CheckIcon size={16} color="#ffffff" />
          <span>Conexión restablecida. Todo sincronizado.</span>
        </>
      ) : (
        <>
          <WifiOffIcon size={16} color="#ffffff" />
          <span>Sin conexión a internet. Verificá tu red en San Rafael.</span>
        </>
      )}
    </aside>
  )
}
