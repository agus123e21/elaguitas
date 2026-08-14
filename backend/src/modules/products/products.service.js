import pool from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';

export async function listProducts({ includeInactive = false } = {}) {
  const { rows } = await pool.query(
    `SELECT id, name, description, price, image, stock, active, created_at, updated_at
       FROM products
      WHERE $1::boolean OR active = TRUE
      ORDER BY name`,
    [includeInactive]
  );
  return rows;
}

export async function getProductById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, description, price, image, stock, active, created_at, updated_at
       FROM products
      WHERE id = $1`,
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, 'Producto no encontrado');
  }
  return rows[0];
}

export async function createProduct({ name, description, price, image, stock }) {
  const { rows } = await pool.query(
    `INSERT INTO products (name, description, price, image, stock)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description ?? null, price, image ?? null, stock ?? 0]
  );
  return rows[0];
}

export async function updateProduct(id, fields) {
  await getProductById(id);

  const allowed = ['name', 'description', 'price', 'image', 'stock', 'active'];
  const sets = [];
  const params = [];
  let i = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = $${i}`);
      params.push(fields[key]);
      i += 1;
    }
  }

  if (sets.length === 0) {
    return getProductById(id);
  }

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE products SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    params
  );
  return rows[0];
}

export async function softDeleteProduct(id) {
  return updateProduct(id, { active: false });
}

export async function reduceStock(items) {
  for (const item of items) {
    const { rows } = await pool.query(
      `UPDATE products
          SET stock = stock - $1
        WHERE id = $2 AND stock >= $1
        RETURNING id`,
      [item.quantity, item.productId]
    );
    if (rows.length === 0) {
      throw new ApiError(409, 'Stock insuficiente');
    }
  }
}
