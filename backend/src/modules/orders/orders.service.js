import pool from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { findActivePromotionByCode, computeDiscount } from '../promotions/promotions.service.js';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export function assertOrderStatus(status) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, `Estado inválido: ${status}`);
  }
}

export async function getCustomerIdByUserId(userId) {
  const { rows } = await pool.query('SELECT id FROM customers WHERE user_id = $1', [userId]);
  return rows[0]?.id ?? null;
}

export async function getDriverIdByUserId(userId) {
  const { rows } = await pool.query('SELECT id FROM delivery_drivers WHERE user_id = $1', [userId]);
  return rows[0]?.id ?? null;
}

export async function getOrderById(id, { scopes } = {}) {
  const { rows } = await pool.query(
    `SELECT o.*,
            a.street, a.city, a.lat, a.lng,
            z.name AS zone_name, z.price AS zone_price,
            c.name AS customer_name, c.phone AS customer_phone,
            d.name AS driver_name
       FROM orders o
       JOIN addresses a ON a.id = o.address_id
       LEFT JOIN delivery_zones z ON z.id = a.delivery_zone_id
       LEFT JOIN users c ON c.id = (SELECT user_id FROM customers WHERE id = o.customer_id)
       LEFT JOIN delivery_drivers dd ON dd.id = o.driver_id
       LEFT JOIN users d ON d.id = dd.user_id
      WHERE o.id = $1`,
    [id]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Pedido no encontrado');
  }

  const order = rows[0];

  if (scopes?.customerId && Number(order.customer_id) !== Number(scopes.customerId)) {
    throw new ApiError(403, 'No tenés permisos para ver este pedido');
  }

  if (scopes?.driverId && Number(order.driver_id) !== Number(scopes.driverId)) {
    throw new ApiError(403, 'Este pedido no te está asignado');
  }

  const items = await getOrderItems(id);
  order.items = items;
  return order;
}

export async function getOrderItems(orderId) {
  const { rows } = await pool.query(
    `SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price, oi.subtotal,
            p.name AS product_name, p.image AS product_image
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1
      ORDER BY oi.id`,
    [orderId]
  );
  return rows;
}

export async function listOrders({ customerId, driverId, status, role, limit = 100, offset = 0 }) {
  const conditions = [];
  const params = [];

  if (role !== 'ADMIN') {
    if (customerId) {
      params.push(customerId);
      conditions.push(`o.customer_id = $${params.length}`);
    } else if (driverId) {
      params.push(driverId);
      conditions.push(`o.driver_id = $${params.length}`);
    }
  }

  if (status) {
    assertOrderStatus(status);
    params.push(status);
    conditions.push(`o.status = $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit);
  params.push(offset);

  const { rows } = await pool.query(
    `SELECT o.id, o.status, o.subtotal, o.delivery_fee, o.discount, o.total,
            o.payment_method, o.created_at, o.containers_delivered, o.containers_returned, o.notes,
            o.driver_id,
            a.street, a.city, a.lat, a.lng,
            c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
            d.name AS driver_name,
            COALESCE(
              (SELECT json_agg(json_build_object(
                'id', oi.id,
                'productId', oi.product_id,
                'productName', p.name,
                'quantity', oi.quantity,
                'unitPrice', oi.unit_price,
                'subtotal', oi.subtotal
              ))
               FROM order_items oi
               JOIN products p ON p.id = oi.product_id
              WHERE oi.order_id = o.id), '[]'::json
            ) AS items
       FROM orders o
       JOIN addresses a ON a.id = o.address_id
       JOIN customers cu ON cu.id = o.customer_id
       JOIN users c ON c.id = cu.user_id
       LEFT JOIN delivery_drivers dd ON dd.id = o.driver_id
       LEFT JOIN users d ON d.id = dd.user_id
       ${where}
      ORDER BY o.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return rows;
}

async function loadLines(items) {
  const ids = items.map((i) => i.productId);
  const { rows } = await pool.query(
    `SELECT id, name, price, stock, active FROM products WHERE id = ANY($1::bigint[])`,
    [ids]
  );

  const byId = new Map(rows.map((p) => [Number(p.id), p]));
  const lines = [];

  for (const item of items) {
    const product = byId.get(Number(item.productId));
    if (!product) {
      throw new ApiError(400, `Producto inexistente (id ${item.productId})`);
    }
    if (!product.active) {
      throw new ApiError(409, `El producto "${product.name}" ya no está disponible`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(409, `Stock insuficiente de "${product.name}"`);
    }
    lines.push({
      productId: Number(product.id),
      name: product.name,
      quantity: item.quantity,
      unitPrice: Number(product.price),
      subtotal: Number(product.price) * item.quantity,
    });
  }

  return { lines, byId };
}

async function loadAddressForCustomer(addressId, customerId) {
  const { rows } = await pool.query(
    `SELECT a.*, z.name AS zone_name, z.price AS zone_price
       FROM addresses a
       LEFT JOIN delivery_zones z ON z.id = a.delivery_zone_id
      WHERE a.id = $1 AND a.customer_id = $2 AND a.active = TRUE`,
    [addressId, customerId]
  );
  if (rows.length === 0) {
    throw new ApiError(400, 'Dirección inválida');
  }
  return rows[0];
}

export async function previewOrder({ customerId, addressId, items, promotionCode }) {
  if (!items || items.length === 0) {
    throw new ApiError(400, 'El pedido no tiene productos');
  }
  const { lines } = await loadLines(items);
  const address = await loadAddressForCustomer(addressId, customerId);

  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const deliveryFee = Number(address.zone_price || 0);
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);

  const promotion = promotionCode ? await findActivePromotionByCode(promotionCode) : null;
  const { discount, deliveryFee: finalDeliveryFee, applied } = computeDiscount(promotion, {
    subtotal,
    deliveryFee,
    lines,
    totalQuantity,
  });

  return {
    subtotal,
    deliveryFee: finalDeliveryFee,
    discount,
    total: subtotal + finalDeliveryFee - discount,
    promotion: applied
      ? { code: applied.code, name: applied.name, type: applied.type }
      : null,
    zoneName: address.zone_name ?? null,
  };
}

export async function createOrder({ customerId, addressId, items, paymentMethod, containersDelivered = 0, containersReturned = 0, notes, promotionCode }) {
  if (!items || items.length === 0) {
    throw new ApiError(400, 'El pedido no tiene productos');
  }
  if (!['CASH', 'CARD', 'TRANSFER'].includes(paymentMethod)) {
    throw new ApiError(400, 'Método de pago inválido');
  }

  const { lines, byId } = await loadLines(items);
  const address = await loadAddressForCustomer(addressId, customerId);

  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const deliveryFee = Number(address.zone_price || 0);
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);

  const promotion = promotionCode
    ? await findActivePromotionByCode(promotionCode)
    : null;
  if (promotionCode && !promotion) {
    throw new ApiError(400, 'Código de promoción inválido o vencido');
  }

  const { discount, deliveryFee: finalDeliveryFee } = computeDiscount(promotion, {
    subtotal,
    deliveryFee,
    lines,
    totalQuantity,
  });
  const total = subtotal + finalDeliveryFee - discount;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const order = await client.query(
      `INSERT INTO orders (customer_id, address_id, status, subtotal, delivery_fee, discount, total, payment_method, containers_delivered, containers_returned, notes)
       VALUES ($1, $2, 'PENDING', $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        customerId,
        addressId,
        subtotal,
        finalDeliveryFee,
        discount,
        total,
        paymentMethod,
        containersDelivered,
        containersReturned,
        notes ?? null,
      ]
    );
    const orderId = order.rows[0].id;

    for (const line of lines) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, line.productId, line.quantity, line.unitPrice, line.subtotal]
      );
      const updated = await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING id`,
        [line.quantity, line.productId]
      );
      if (updated.rows.length === 0) {
        throw new ApiError(409, `Stock insuficiente de "${line.name}"`);
      }
      if (containersDelivered > 0) {
        await client.query(
          `INSERT INTO container_movements (customer_id, order_id, type, quantity, notes)
           VALUES ($1, $2, 'DELIVERED', $3, $4)`,
          [customerId, orderId, containersDelivered, 'Entrega de bidones']
        );
      }
      if (containersReturned > 0) {
        await client.query(
          `INSERT INTO container_movements (customer_id, order_id, type, quantity, notes)
           VALUES ($1, $2, 'RETURNED', $3, $4)`,
          [customerId, orderId, containersReturned, 'Retiro de bidones']
        );
      }
    }

    await client.query(
      `INSERT INTO payments (order_id, method, status, amount)
       VALUES ($1, $2, 'PENDING', $3)`,
      [orderId, paymentMethod, total]
    );

    await client.query(
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES ((SELECT user_id FROM customers WHERE id = $1), 'ORDER', 'Pedido creado', $2)`,
      [customerId, `Tu pedido #${orderId} fue creado y está pendiente de confirmación`]
    );

    await client.query('COMMIT');
    return getOrderById(orderId, { scopes: { customerId } });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function repeatOrder(orderId, customerId) {
  const source = await getOrderById(orderId, { scopes: { customerId } });
  const items = source.items.map((i) => ({
    productId: Number(i.product_id),
    quantity: i.quantity,
  }));
  return createOrder({
    customerId,
    addressId: Number(source.address_id),
    items,
    paymentMethod: source.payment_method,
    containersDelivered: source.containers_delivered,
    containersReturned: source.containers_returned,
    notes: source.notes,
  });
}

export async function changeOrderStatus(orderId, status, actor) {
  assertOrderStatus(status);
  const order = await getOrderById(orderId, { scopes: actor?.scope });

  if (order.status === 'CANCELLED') {
    throw new ApiError(409, 'El pedido ya fue cancelado');
  }

  if (order.status === 'DELIVERED') {
    throw new ApiError(409, 'El pedido ya fue entregado');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);

    if (status === 'CANCELLED') {
      for (const item of order.items) {
        await client.query(
          `UPDATE products SET stock = stock + $1 WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }
      await client.query(`UPDATE payments SET status = 'REFUNDED' WHERE order_id = $1`, [orderId]);
    }

    if (status === 'DELIVERED') {
      await client.query(`UPDATE payments SET status = 'PAID' WHERE order_id = $1`, [orderId]);
      await client.query(
        `INSERT INTO deliveries (order_id, driver_id, status, delivered_at)
         VALUES ($1, $2, 'DELIVERED', NOW())
         ON CONFLICT (order_id) DO UPDATE
           SET status = 'DELIVERED', delivered_at = NOW()`,
        [orderId, order.driver_id ?? null]
      );
    }

    if (status === 'OUT_FOR_DELIVERY') {
      await client.query(
        `INSERT INTO deliveries (order_id, driver_id, status)
         VALUES ($1, $2, 'IN_TRANSIT')
         ON CONFLICT (order_id) DO UPDATE SET status = 'IN_TRANSIT'`,
        [orderId, order.driver_id ?? null]
      );
    }

    await client.query(
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES ((SELECT user_id FROM customers WHERE id = $1), 'ORDER', $2, $3)`,
      [order.customer_id, 'Estado del pedido', `Tu pedido #${orderId} ahora está: ${status}`]
    );

    await client.query('COMMIT');
    return getOrderById(orderId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function assignDriver(orderId, driverId) {
  const order = await getOrderById(orderId);

  const { rows } = await pool.query(
    `SELECT 1 FROM delivery_drivers WHERE id = $1 AND active = TRUE`,
    [driverId]
  );
  if (rows.length === 0) {
    throw new ApiError(400, 'Repartidor inválido');
  }

  await pool.query(`UPDATE orders SET driver_id = $1 WHERE id = $2`, [driverId, orderId]);

  const upsert = await pool.query(
    `INSERT INTO deliveries (order_id, driver_id, status)
     VALUES ($1, $2, 'ASSIGNED')
     ON CONFLICT (order_id) DO UPDATE SET driver_id = EXCLUDED.driver_id, status = 'ASSIGNED'
     RETURNING id`,
    [orderId, driverId]
  );

  await pool.query(
    `INSERT INTO notifications (user_id, type, title, message)
     VALUES ((SELECT user_id FROM delivery_drivers WHERE id = $1), 'DELIVERY', 'Pedido asignado', $2)`,
    [driverId, `Te asignaron el pedido #${orderId}`]
  );

  return { order: await getOrderById(orderId), deliveryId: upsert.rows[0].id };
}
