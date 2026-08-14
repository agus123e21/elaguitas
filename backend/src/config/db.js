import pg from 'pg';
import env from './env.js';

const poolConfig = {
  connectionString: env.databaseUrl || undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Habilitar SSL para conexiones remotas a Supabase / PostgreSQL cloud sin fallar por certs
if (
  env.databaseUrl &&
  !env.databaseUrl.includes('localhost') &&
  !env.databaseUrl.includes('127.0.0.1')
) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new pg.Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[db] Error inesperado en el pool de conexiones:', err.message);
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function checkConnection() {
  const result = await pool.query('SELECT NOW() AS now, current_database() AS db');
  return result.rows[0];
}

export default pool;
