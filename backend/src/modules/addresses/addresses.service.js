import pool from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';

export async function listCustomerAddresses(customerId) {
  const { rows } = await pool.query(
    `SELECT a.id, a.label, a.street, a.city, a.lat, a.lng, a.is_primary, a.active,
            a.delivery_zone_id, z.name AS zone_name, z.price AS zone_price
       FROM addresses a
       LEFT JOIN delivery_zones z ON z.id = a.delivery_zone_id
      WHERE a.customer_id = $1 AND a.active = TRUE
      ORDER BY a.is_primary DESC, a.id`,
    [customerId]
  );
  return rows;
}

export async function getAddressById(id, customerId) {
  const { rows } = await pool.query(
    `SELECT a.*, z.name AS zone_name, z.price AS zone_price
       FROM addresses a
       LEFT JOIN delivery_zones z ON z.id = a.delivery_zone_id
      WHERE a.id = $1 AND a.customer_id = $2 AND a.active = TRUE`,
    [id, customerId]
  );
  if (rows.length === 0) {
    throw new ApiError(404, 'Dirección no encontrada');
  }
  return rows[0];
}

export async function createAddress(customerId, data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const count = await client.query(
      'SELECT COUNT(*) AS total FROM addresses WHERE customer_id = $1 AND active = TRUE',
      [customerId]
    );
    const isPrimary = data.isPrimary ?? count.rows[0].total === 0;

    if (isPrimary) {
      await client.query(
        'UPDATE addresses SET is_primary = FALSE WHERE customer_id = $1',
        [customerId]
      );
    }

    const { rows } = await client.query(
      `INSERT INTO addresses (customer_id, label, street, city, lat, lng, delivery_zone_id, is_primary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        customerId,
        data.label ?? null,
        data.street,
        data.city ?? null,
        data.lat ?? null,
        data.lng ?? null,
        data.deliveryZoneId ?? null,
        isPrimary,
      ]
    );

    await client.query('COMMIT');
    return getAddressById(rows[0].id, customerId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateAddress(id, customerId, fields) {
  await getAddressById(id, customerId);

  const allowed = ['label', 'street', 'city', 'lat', 'lng', 'deliveryZoneId', 'isPrimary'];
  const sets = [];
  const params = [];
  let i = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key === 'deliveryZoneId' ? 'delivery_zone_id' : key} = $${i}`);
      params.push(fields[key]);
      i += 1;
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (fields.isPrimary) {
      await client.query(
        'UPDATE addresses SET is_primary = FALSE WHERE customer_id = $1',
        [customerId]
      );
    }

    params.push(id);
    await client.query(`UPDATE addresses SET ${sets.join(', ')} WHERE id = $${i}`, params);

    await client.query('COMMIT');
    return getAddressById(id, customerId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteAddress(id, customerId) {
  await getAddressById(id, customerId);
  await pool.query('UPDATE addresses SET active = FALSE WHERE id = $1', [id]);
  return { id, active: false };
}
