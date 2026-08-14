import api from './api.js'

export async function getZones(token, { all = false } = {}) {
  const data = await api.get(`/zones${all ? '?all=true' : ''}`, { token })
  return data.zones
}

export async function createZone(payload, token) {
  const data = await api.post('/zones', payload, { token })
  return data.zone
}

export async function updateZone(id, payload, token) {
  const data = await api.patch(`/zones/${id}`, payload, { token })
  return data.zone
}
