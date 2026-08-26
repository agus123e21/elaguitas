const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export { BASE_URL };

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  const rawToken = token || localStorage.getItem('agua_token') || localStorage.getItem('token');
  const activeToken = rawToken && rawToken !== 'undefined' && rawToken !== 'null' && typeof rawToken === 'string' && rawToken.trim() !== '' ? rawToken.trim() : null;
  if (activeToken) {
    options.headers.Authorization = `Bearer ${activeToken}`;
  }

  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch (networkErr) {
    throw new ApiError(503, `Error de conexión con el servidor (${networkErr.message || 'Sin conexión'})`);
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    // Si el token es inválido o expiró, limpiar el almacenamiento para evitar loops de error
    if (response.status === 401 && activeToken) {
      localStorage.removeItem('agua_token');
      localStorage.removeItem('agua_user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    const message =
      data?.error?.message ||
      data?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      (response.status === 404
        ? `Ruta no encontrada (404): ${path}`
        : response.status === 401
        ? 'Sesión expirada o credenciales inválidas (401)'
        : response.status === 403
        ? 'No tenés permisos para realizar esta acción (403)'
        : response.status >= 500
        ? `Error interno del servidor (${response.status})`
        : 'Error inesperado');

    throw new ApiError(response.status, message, data?.error?.details);
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { method: 'GET', ...options }),
  post: (path, body, options) => request(path, { method: 'POST', body, ...options }),
  put: (path, body, options) => request(path, { method: 'PUT', body, ...options }),
  patch: (path, body, options) => request(path, { method: 'PATCH', body, ...options }),
  delete: (path, options) => request(path, { method: 'DELETE', ...options }),
};

export default api;
