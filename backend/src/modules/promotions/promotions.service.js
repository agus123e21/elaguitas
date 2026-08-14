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

export function computeDiscount(promotion, { subtotal, deliveryFee, lines, totalQuantity }) {
  if (!promotion) {
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
