import pool from '../../config/db.js';

export async function findActivePromotionByCode(code) {
  const { rows } = await pool.query(
    `SELECT *
       FROM promotions
      WHERE code = $1
        AND active = TRUE
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at IS NULL OR ends_at >= NOW())`,
    [code]
  );
  return rows[0] || null;
}

export function computeDiscount(promotion, { subtotal, deliveryFee, lines, totalQuantity }) {  if (!promotion) {
    return { discount: 0, deliveryFee, applied: null };
  }

  const { type, value, min_quantity: minQuantity, min_order_amount: minOrderAmount } = promotion;

  if (minOrderAmount && subtotal < Number(minOrderAmount)) {
    return { discount: 0, deliveryFee, applied: null };
  }
  if (minQuantity && totalQuantity < minQuantity) {
    return { discount: 0, deliveryFee, applied: null };
  }

  let discount = 0;
  let nextDeliveryFee = deliveryFee;

  if (type === 'PERCENTAGE') {
    discount = (subtotal * Number(value)) / 100;
  } else if (type === 'FIXED_AMOUNT') {
    discount = Math.min(Number(value), subtotal);
  } else if (type === 'FREE_SHIPPING') {
    nextDeliveryFee = 0;
  } else if (type === 'PACK') {
    const packQuantity = promotion.pack_quantity || minQuantity || 0;
    const qualifying = lines
      .filter((line) => line.quantity >= packQuantity)
      .reduce((sum, line) => sum + line.subtotal, 0);
    discount = (qualifying * Number(value)) / 100;
  }

  discount = Math.min(discount, subtotal);
  return { discount, deliveryFee: nextDeliveryFee, applied: promotion };
}

export async function listPromotions({ includeInactive = false } = {}) {
  const { rows } = await pool.query(
    `SELECT *
       FROM promotions
      ${includeInactive ? '' : "WHERE active = TRUE AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW())"}
      ORDER BY created_at DESC`
  );
  return rows;
}

export async function getPromotionById(id) {
  const { rows } = await pool.query(`SELECT * FROM promotions WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function createPromotion(fields) {
  const { name, code, type, value, packQuantity, minQuantity, minOrderAmount, active, startsAt, endsAt } = fields;
  const { rows } = await pool.query(
    `INSERT INTO promotions (name, code, type, value, pack_quantity, min_quantity, min_order_amount, active, starts_at, ends_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [name, code ?? null, type, value ?? null, packQuantity ?? null, minQuantity ?? null, minOrderAmount ?? null, active ?? true, startsAt ?? null, endsAt ?? null]
  );
  return rows[0];
}

export async function updatePromotion(id, fields) {
  const existing = await getPromotionById(id);
  if (!existing) return null;

  const { name, code, type, value, packQuantity, minQuantity, minOrderAmount, active, startsAt, endsAt } = fields;
  const { rows } = await pool.query(
    `UPDATE promotions
        SET name = COALESCE($1, name),
            code = COALESCE($2, code),
            type = COALESCE($3, type),
            value = COALESCE($4, value),
            pack_quantity = COALESCE($5, pack_quantity),
            min_quantity = COALESCE($6, min_quantity),
            min_order_amount = COALESCE($7, min_order_amount),
            active = COALESCE($8, active),
            starts_at = COALESCE($9, starts_at),
            ends_at = COALESCE($10, ends_at)
      WHERE id = $11
      RETURNING *`,
    [name ?? null, code ?? null, type ?? null, value ?? null, packQuantity ?? null, minQuantity ?? null, minOrderAmount ?? null, active ?? null, startsAt ?? null, endsAt ?? null, id]
  );
  return rows[0];
}

export async function deletePromotion(id) {
  const { rows } = await pool.query(`DELETE FROM promotions WHERE id = $1 RETURNING id`, [id]);
  return rows[0] || null;
}
