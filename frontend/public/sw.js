const CACHE_NAME = 'agua-v2'
const BASE = self.registration ? new URL('.', self.registration.scope).href : self.location.origin + '/'
const APP_SHELL = [BASE, BASE + 'index.html', BASE + 'manifest.webmanifest', BASE + 'favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.pathname.startsWith('/api') || url.pathname.includes('/api/')) return
  if (!url.href.startsWith(BASE)) return

  // Navegación: Network-first, si falla usa cache de index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(BASE + 'index.html', copy))
          }
          return response
        })
        .catch(() => caches.match(BASE + 'index.html'))
    )
    return
  }

  // Assets (scripts, estilos, imágenes):
  // NUNCA devolver index.html para un archivo .js o .css, porque provoca el error
  // "Expected a JavaScript module script but server responded with MIME type text/html"
  const isCodeAsset = request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/assets/')

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => {
          if (isCodeAsset) {
            // Devolver 404 text/plain para que el manejador de preloadError de Vite o React pueda detectar el fallo y recargar
            return new Response('Asset not found', { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'text/plain' } })
          }
          return caches.match(BASE + 'index.html').then((fallback) => {
            return fallback || new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
          })
        })
    })
  )
})
