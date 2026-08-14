import api from './api.js'

export async function getMySubscriptions(token) {
  const data = await api.get('/subscriptions', { token })
  return data.subscriptions
}

export async function createSubscription(payload, token) {
  const data = await api.post('/subscriptions', payload, { token })
  return data.subscription
}

export async function updateSubscription(id, payload, token) {
  const data = await api.patch(`/subscriptions/${id}`, payload, { token })
  return data.subscription
}
