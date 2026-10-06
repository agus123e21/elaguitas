/**
 * Script de Verificación de Integridad y Conexión de Base de Datos
 * Autor: Arian (arianluszczak@gmail.com)
 * Proyecto: El Agüitas
 */

import pool from '../src/config/db.js';

export async function auditDatabase() {
  console.log('--- Iniciando Auditoría de Integridad DB ---');
  const client = await pool.connect();
  try {
    // 1. Validar versión de PostgreSQL
    const versionRes = await client.query('SELECT version()');
    console.log('[OK] PostgreSQL:', versionRes.rows[0].version.split(' ')[0], versionRes.rows[0].version.split(' ')[1]);

    // 2. Comprobar conteo de tablas del sistema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`[OK] Tablas públicas encontradas (${tablesRes.rowCount}):`);
    tablesRes.rows.forEach(r => console.log(`  - ${r.table_name}`));

    // 3. Comprobar índices activos
    const indexRes = await client.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);
    console.log(`[OK] Total índices indexados: ${indexRes.rowCount}`);

    // 4. Integridad de productos activos
    const productsRes = await client.query(`
      SELECT id, name, price, stock, is_active 
      FROM products 
      WHERE is_active = true 
      ORDER BY id
    `);
    console.log(`[OK] Catálogo activo: ${productsRes.rowCount} productos.`);

    console.log('--- Auditoría Finalizada Satisfactoriamente ---');
  } catch (err) {
    console.error('[ERROR] Fallo en la auditoría de DB:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
  }
}

// Ejecución directa
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  auditDatabase()
    .then(() => pool.end())
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
