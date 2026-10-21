import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Manejador oficial de Vite para fallos de carga dinámica de chunks (Stale deployments)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Detectado chunk desactualizado tras nuevo despliegue. Recargando aplicación...', event)
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((registration) => {
      // Verificar si hay actualización pendiente del ServiceWorker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nueva versión disponible en servidor. Actualizando caché...')
            }
          })
        }
      })
    }).catch(() => {})
  })
}
