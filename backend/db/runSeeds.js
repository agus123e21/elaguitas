import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pool from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEEDS_DIR = path.join(__dirname, 'seeds');

async function runSeeds() {
  const files = (await readdir(SEEDS_DIR))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('[db] No hay seeds para ejecutar.');
    return;
  }

  for (const file of files) {
    const sql = await readFile(path.join(SEEDS_DIR, file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`[db] Seed ejecutada: ${file}`);
    } catch (err) {
      console.error(`[db] Error en seed ${file}:`, err.message);
      throw err;
    }
  }
}

const isDirect = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirect) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[db] Seeds fallaron.', err);
      process.exit(1);
    });
}

export default runSeeds;
