import pool from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';

export async function getCustomerSummary(customerId) {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'DELIVERED' THEN quantity ELSE 0 END), 0)::int AS delivered,
       COALESCE(SUM(CASE WHEN type = 'RETURNED' THEN quantity ELSE 0 END), 0)::int AS returned,
       COALESCE(SUM(CASE WHEN type = 'DELIVERED' THEN quantity
                         WHEN type = 'RETURNED' THEN -quantity ELSE 0 END), 0)::int AS pending
     FROM container_movements
     WHERE customer_id = $1`,
    [customerId]
  );

  const { rows: containerRows } = await pool.query(
    `SELECT COUNT(*)::int AS total
       FROM containers
      WHERE customer_id = $1 AND status = 'WITH_CUSTOMER'`,
    [customerId]
  );

  const summary = rows[0];
  summary.withCustomer = containerRows[0].total;
  summary.pending = Math.max(0, summary.pending);
  return summary;
}

export async function getCustomerMovements(customerId) {
  const { rows } = await pool.query(
    `SELECT cm.id, cm.type, cm.quantity, cm.notes, cm.created_at,
            o.id AS order_id, o.status AS order_status
       FROM container_movements cm
       LEFT JOIN orders o ON o.id = cm.order_id
      WHERE cm.customer_id = $1
      ORDER BY cm.created_at DESC
      LIMIT 100`,
    [customerId]
  );
  return rows;
}

export async function listInventory() {
  const { rows } = await pool.query(
    `SELECT ct.id, ct.status, ct.created_at,
            cu.name AS customer_name
       FROM containers ct
       LEFT JOIN customers c ON c.id = ct.customer_id
       LEFT JOIN users cu ON cu.id = c.user_id
      ORDER BY ct.id`,
  );
  return rows;
}

export async function registerContainers(quantity) {
  const values = Array.from({ length: quantity }, () => '(DEFAULT)').join(', ');
  const { rowCount } = await pool.query(
    `INSERT INTO containers (status) VALUES ${values}`
  );
  return { created: rowCount };
}

export async function updateContainerStatus(id, { status, customerId }) {
  const { rows } = await pool.query(
    `UPDATE containers
        SET status = $1,
            customer_id = $2
      WHERE id = $3
      RETURNING id, status, customer_id`,
    [status, customerId ?? null, id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, 'Bidón no encontrado');
  }
  return rows[0];
}

export async function createMovement({ customerId, type, quantity, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO container_movements (customer_id, order_id, type, quantity, notes)
     VALUES ($1, NULL, $2, $3, $4)
     RETURNING *`,
    [customerId, type, quantity, notes ?? null]
  );
  return rows[0];
}
