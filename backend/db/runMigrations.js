import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pool from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getApplied() {
  const { rows } = await pool.query('SELECT name FROM schema_migrations');
  return new Set(rows.map((r) => r.name));
}

async function runMigrations({ down = false } = {}) {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('[db] No hay migraciones pendientes.');
    return [];
  }

  await ensureMigrationsTable();
  const applied = await getApplied();

  const pending = down
    ? files.filter((f) => applied.has(f)).reverse()
    : files.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log('[db] Todas las migraciones ya fueron aplicadas.');
    return [];
  }

  const appliedNames = [];

  for (const file of pending) {
    const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      if (down) {
        await client.query('DELETE FROM schema_migrations WHERE name = $1', [file]);
      } else {
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      }
      await client.query('COMMIT');
      appliedNames.push(`${down ? 'ROLLED BACK' : 'APLICADA'}: ${file}`);
      console.log(`[db] ${down ? 'Revertida' : 'Aplicada'}: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`[db] Error en migración ${file}:`, err.message);
      throw err;
    } finally {
      client.release();
    }
  }

  return appliedNames;
}

const isDirect = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirect) {
  const down = process.argv.includes('--down');
  runMigrations({ down })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[db] Migraciones fallaron.', err);
      process.exit(1);
    });
}

export default runMigrations;
