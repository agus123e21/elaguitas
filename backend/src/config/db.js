import pg from 'pg';
import env from './env.js';

const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

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
