import api, { BASE_URL } from './api.js'

export async function getProducts({ token, includeInactive = false } = {}) {
  const query = includeInactive ? '?all=true' : ''
  const data = await api.get(`/products${query}`, { token })
  return data.products
}

export async function getProduct(id) {
  const data = await api.get(`/products/${id}`)
  return data.product
}

export async function createProduct(payload, token) {
  const data = await api.post('/products', payload, { token })
  return data.product
}

export async function updateProduct(id, payload, token) {
  const data = await api.put(`/products/${id}`, payload, { token })
  return data.product
}

export async function patchProduct(id, payload, token) {
  const data = await api.patch(`/products/${id}`, payload, { token })
  return data.product
}

export async function deleteProduct(id, token) {
  const data = await api.delete(`/products/${id}`, { token })
  return data.product
}

export async function uploadProductImage(file, token) {
  const form = new FormData()
  form.append('image', file)
  const response = await fetch(`${BASE_URL}/products/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Error al subir imagen')
  }
  return data.url
}
