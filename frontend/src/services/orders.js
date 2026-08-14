import api from './api.js'

export async function previewOrder(payload, token) {
  const data = await api.post('/orders/preview', payload, { token })
  return data.preview
}

export async function createOrder(payload, token) {
  const data = await api.post('/orders', payload, { token })
  return data.order
}

export async function getMyOrders(token) {
  const data = await api.get('/orders', { token })
  return data.orders
}

export async function getOrdersByStatus(status, token) {
  const data = await api.get(`/orders?status=${status}`, { token })
  return data.orders
}

export async function getOrder(id, token) {
  const data = await api.get(`/orders/${id}`, { token })
  return data.order
}

export async function repeatOrder(id, token) {
  const data = await api.post(`/orders/${id}/repeat`, null, { token })
  return data.order
}

export async function changeOrderStatus(id, status, token) {
  const data = await api.patch(`/orders/${id}/status`, { status }, { token })
  return data.order
}

export async function assignDriver(id, driverId, token) {
  const data = await api.post(`/orders/${id}/assign-driver`, { driverId }, { token })
  return data.order
}
