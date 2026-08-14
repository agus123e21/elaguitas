import pool from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { createOrder } from '../orders/orders.service.js';

const FREQUENCIES = [3, 7, 15, 30];
const STATUSES = ['ACTIVE', 'PAUSED', 'CANCELLED'];

export function assertFrequency(frequencyDays) {
  if (!FREQUENCIES.includes(frequencyDays)) {
    throw new ApiError(400, `Frecuencia inválida: debe ser una de ${FREQUENCIES.join(', ')}`);
  }
}

export function assertStatus(status) {
  if (!STATUSES.includes(status)) {
    throw new ApiError(400, `Estado de suscripción inválido: ${status}`);
  }
}

export async function listSubscriptions(customerId) {
  const { rows } = await pool.query(
    `SELECT s.*, p.name AS product_name, p.price, a.street, a.city, z.name AS zone_name
       FROM subscriptions s
       JOIN products p ON p.id = s.product_id
       JOIN addresses a ON a.id = s.address_id
       LEFT JOIN delivery_zones z ON z.id = a.delivery_zone_id
      WHERE s.customer_id = $1 AND s.status <> 'CANCELLED'
      ORDER BY s.created_at DESC`,
    [customerId]
  );
  return rows;
}

export async function createSubscription({ customerId, addressId, productId, quantity, frequencyDays }) {
  assertFrequency(frequencyDays);

  const address = await pool.query(
    `SELECT 1 FROM addresses WHERE id = $1 AND customer_id = $2 AND active = TRUE`,
    [addressId, customerId]
  );
  if (address.rows.length === 0) {
    throw new ApiError(400, 'Dirección inválida');
  }

  const product = await pool.query(
    `SELECT 1 FROM products WHERE id = $1 AND active = TRUE`,
    [productId]
  );
  if (product.rows.length === 0) {
    throw new ApiError(400, 'Producto inválido o inactivo');
  }

  const nextDeliveryDate = new Date();
  nextDeliveryDate.setDate(nextDeliveryDate.getDate() + frequencyDays);

  const { rows } = await pool.query(
    `INSERT INTO subscriptions (customer_id, address_id, product_id, quantity, frequency_days, next_delivery_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [customerId, addressId, productId, quantity, frequencyDays, nextDeliveryDate.toISOString().slice(0, 10)]
  );

  const { rows: detail } = await pool.query(
    `SELECT s.*, p.name AS product_name, p.price, a.street, a.city
       FROM subscriptions s
       JOIN products p ON p.id = s.product_id
       JOIN addresses a ON a.id = s.address_id
      WHERE s.id = $1`,
    [rows[0].id]
  );

  return detail[0];
}

export async function updateSubscription(id, customerId, fields) {
  const existing = await pool.query(
    `SELECT * FROM subscriptions WHERE id = $1 AND customer_id = $2`,
    [id, customerId]
  );
  if (existing.rows.length === 0) {
    throw new ApiError(404, 'Suscripción no encontrada');
  }
  if (existing.rows[0].status === 'CANCELLED') {
    throw new ApiError(409, 'La suscripción ya fue cancelada');
  }

  const { status, quantity, frequencyDays, nextDeliveryDate } = fields;
  if (status) assertStatus(status);
  if (frequencyDays) assertFrequency(frequencyDays);

  const { rows } = await pool.query(
    `UPDATE subscriptions
        SET status = COALESCE($1, status),
            quantity = COALESCE($2, quantity),
            frequency_days = COALESCE($3, frequency_days),
            next_delivery_date = COALESCE($4, next_delivery_date),
            updated_at = NOW()
      WHERE id = $5
      RETURNING *`,
    [status ?? null, quantity ?? null, frequencyDays ?? null, nextDeliveryDate ?? null, id]
  );

  return rows[0];
}

export async function processDueSubscriptions() {
  const { rows } = await pool.query(
    `SELECT s.*, c.user_id
       FROM subscriptions s
       JOIN customers c ON c.id = s.customer_id
      WHERE s.status = 'ACTIVE' AND s.next_delivery_date <= CURRENT_DATE`
  );

  const results = { created: 0, errors: 0 };
  for (const sub of rows) {
    try {
      await createOrder({
        customerId: sub.customer_id,
        addressId: sub.address_id,
        items: [{ productId: Number(sub.product_id), quantity: sub.quantity }],
        paymentMethod: 'CASH',
        containersDelivered: 0,
        containersReturned: 0,
        notes: `Entrega automática de suscripción #${sub.id}`,
      });

      const next = new Date();
      next.setDate(next.getDate() + sub.frequency_days);
      await pool.query(
        `UPDATE subscriptions SET next_delivery_date = $1, updated_at = NOW() WHERE id = $2`,
        [next.toISOString().slice(0, 10), sub.id]
      );
      results.created += 1;
    } catch {
      results.errors += 1;
    }
  }
  return results;
}
