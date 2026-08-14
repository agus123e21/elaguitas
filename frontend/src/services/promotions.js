import api from './api.js'

export async function getPromotions(token) {
  const data = await api.get('/promotions', { token })
  return data.promotions
}

export async function getAllPromotions(token) {
  const data = await api.get('/promotions?all=true', { token })
  return data.promotions
}

export async function createPromotion(payload, token) {
  const data = await api.post('/promotions', payload, { token })
  return data.promotion
}

export async function updatePromotion(id, payload, token) {
  const data = await api.put(`/promotions/${id}`, payload, { token })
  return data.promotion
}

export async function deletePromotion(id, token) {
  return api.delete(`/promotions/${id}`, { token })
}
