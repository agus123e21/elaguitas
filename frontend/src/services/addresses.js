import api from './api.js'

export async function getAddresses(token) {
  const data = await api.get('/addresses', { token })
  return data.addresses
}

export async function createAddress(payload, token) {
  const data = await api.post('/addresses', payload, { token })
  return data.address
}

export async function updateAddress(id, payload, token) {
  const data = await api.put(`/addresses/${id}`, payload, { token })
  return data.address
}

export async function deleteAddress(id, token) {
  return api.delete(`/addresses/${id}`, { token })
}

export async function getZones(token) {
  const data = await api.get('/zones', { token })
  return data.zones
}
