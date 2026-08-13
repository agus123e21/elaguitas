import 'dotenv/config';
import { ApiError } from '../utils/ApiError.js';

function getEnv(name, required = true) {
  const value = process.env[name];
  if (required && (value === undefined || value === '')) {
    throw new Error(`Falta la variable de entorno: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: Number(getEnv('JWT_EXPIRES_IN', false) || 604800),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
};

export function assertValidEnv() {
  if (!env.jwtSecret || env.jwtSecret.startsWith('change_me')) {
    throw new ApiError(
      500,
      'JWT_SECRET no configurado correctamente. Usá un valor aleatorio y seguro.'
    );
  }
}

export default env;
