export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export function createError(statusCode, message, details) {
  return new ApiError(statusCode, message, details);
}
