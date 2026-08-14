import 'dotenv/config';
import { ApiError } from '../utils/ApiError.js';

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_1234567890',
  jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN || 604800),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
};

export function assertValidEnv() {
  if (!env.databaseUrl) {
    throw new ApiError(500, 'DATABASE_URL no configurada en las variables de entorno.');
  }
  if (!env.jwtSecret || env.jwtSecret.startsWith('change_me')) {
    throw new ApiError(
      500,
      'JWT_SECRET no configurado correctamente. Usá un valor aleatorio y seguro.'
    );
  }
}

export default env;
