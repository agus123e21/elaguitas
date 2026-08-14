import { ApiError } from './ApiError.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  email(value) {
    return typeof value === 'string' && value.length <= 255 && EMAIL_RE.test(value);
  },
  password(value) {
    return typeof value === 'string' && value.length >= 6 && value.length <= 128;
  },
  requiredString(value, max = 255) {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
  },
  optionalString(value, max = 255) {
    return value === undefined || value === null || (typeof value === 'string' && value.length <= max);
  },
  number(value) {
    return typeof value === 'number' && Number.isFinite(value);
  },
  positiveNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
  },
  integer(value) {
    return Number.isInteger(value);
  },
  boolean(value) {
    return typeof value === 'boolean';
  },
  enum(values) {
    return (value) => values.includes(value);
  },
  array(value) {
    return Array.isArray(value);
  },
};

export function validate(body, rules) {
  const errors = [];
  for (const [field, check] of Object.entries(rules)) {
    if (check && !check(body?.[field])) {
      errors.push(field);
    }
  }
  return errors;
}

export function validateMiddleware(rules) {
  return (req, res, next) => {
    const errors = validate(req.body, rules);
    if (errors.length > 0) {
      return next(
        new ApiError(400, 'Datos inválidos', {
          fields: errors,
        })
      );
    }
    return next();
  };
}
