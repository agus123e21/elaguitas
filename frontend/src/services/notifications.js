import api from './api.js'

export async function getNotifications(token) {
  return api.get('/notifications', { token })
}

export async function markNotificationRead(id, token) {
  const data = await api.patch(`/notifications/${id}/read`, {}, { token })
  return data.notification
}

export async function markAllNotificationsRead(token) {
  return api.patch('/notifications/read-all', {}, { token })
}
