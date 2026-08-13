import env from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const isOperational = Boolean(err.isOperational);

  const body = {
    error: {
      code: statusCode,
      message: statusCode >= 500 && !isOperational ? 'Error interno del servidor' : err.message,
    },
  };

  if (err.details !== undefined) {
    body.error.details = err.details;
  }

  if (statusCode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  if (!env.isProduction && !isOperational) {
    body.error.stack = err.stack;
  }

  res.status(statusCode).json(body);
}
