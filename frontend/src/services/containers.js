import api from './api.js'

export async function getContainerSummary(token) {
  const data = await api.get('/containers/summary', { token })
  return data.summary
}

export async function getContainerMovements(token) {
  const data = await api.get('/containers/movements', { token })
  return data.movements
}

export async function getInventory(token) {
  const data = await api.get('/containers', { token })
  return data.containers
}

export async function registerContainers(quantity, token) {
  return api.post('/containers/register', { quantity }, { token })
}

export async function updateContainerStatus(id, payload, token) {
  const data = await api.patch(`/containers/${id}`, payload, { token })
  return data.container
}

export async function adjustContainers(payload, token) {
  const data = await api.post('/containers/adjust', payload, { token })
  return data.movement
}
