const CACHE_NAME = 'agua-v1'
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
  if (url.pathname.startsWith('/api')) return
  if (!url.href.startsWith(BASE)) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(BASE + 'index.html', copy))
          return response
        })
        .catch(() => caches.match(BASE + 'index.html'))
    )
    return
  }

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
          return caches.match(BASE + 'index.html').then((fallback) => {
            return fallback || new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
          })
        })
    })
  )
})
