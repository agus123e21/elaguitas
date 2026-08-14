import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Token no proporcionado'));
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
    return next();
  } catch {
    return next(new ApiError(401, 'Token inválido o expirado'));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Autenticación requerida'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'No tenés permisos para esta acción'));
    }
    return next();
  };
}

export const requireClient = (req, res, next) =>
  authorize('CLIENT', 'ADMIN')(req, res, next);

export const requireAdmin = authorize('ADMIN');
export const requireDriver = authorize('DRIVER', 'ADMIN');
