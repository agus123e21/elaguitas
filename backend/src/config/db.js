import pg from 'pg';
import env from './env.js';

const dbUrl = process.env.DATABASE_URL || env.databaseUrl;

const poolConfig = {
  connectionString: dbUrl || undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Habilitar SSL para conexiones remotas a Supabase / PostgreSQL cloud sin fallar por certs
if (
  dbUrl &&
  !dbUrl.includes('localhost') &&
  !dbUrl.includes('127.0.0.1')
) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new pg.Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[db] Error inesperado en el pool de conexiones:', err.message);
});

export async function query(text, params) {
  const currentUrl = process.env.DATABASE_URL || env.databaseUrl;
  if (!currentUrl) {
    throw new Error('DATABASE_URL no configurada en las variables de entorno del servidor.');
  }
  const result = await pool.query(text, params);
  return result;
}

export async function checkConnection() {
  const currentUrl = process.env.DATABASE_URL || env.databaseUrl;
  if (!currentUrl) {
    throw new Error('DATABASE_URL no configurada en las variables de entorno del servidor.');
  }
  const result = await pool.query('SELECT NOW() AS now, current_database() AS db');
  return result.rows[0];
}

export default pool;
