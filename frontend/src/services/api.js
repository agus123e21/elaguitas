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

  const activeToken = token || localStorage.getItem('agua_token') || localStorage.getItem('token');
  if (activeToken) {
    options.headers.Authorization = `Bearer ${activeToken}`;
  }

  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

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
    throw new ApiError(
      response.status,
      data?.error?.message || 'Error inesperado',
      data?.error?.details
    );
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
