import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAdmin } from '../../middlewares/auth.js';
import { ApiError } from '../../utils/ApiError.js';
import { validateMiddleware, validators } from '../../utils/validate.js';
import logger from '../../utils/logger.js';

const router = Router();
const SALT_ROUNDS = 10;

// GET /api/users - List all users (Admin only)
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { role, includeInactive } = req.query;
    const params = [];
    const conditions = [];

    if (!includeInactive || includeInactive === 'false') {
      conditions.push('u.active = TRUE');
    }

    if (role) {
      params.push(role.toUpperCase());
      conditions.push(`r.name = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.name, u.phone, u.active, u.created_at,
              r.name AS role,
              c.id AS customer_id, 
              d.id AS driver_id, d.vehicle
         FROM users u
         JOIN roles r ON r.id = u.role_id
         LEFT JOIN customers c ON c.user_id = u.id
         LEFT JOIN delivery_drivers d ON d.user_id = u.id
        ${whereClause}
        ORDER BY u.id DESC`,
      params
    );
    res.json({ users: rows });
  })
);

// POST /api/users - Create a new user with role (Admin only)
router.post(
  '/',
  requireAdmin,
  validateMiddleware({
    name: validators.requiredString,
    email: validators.email,
    password: validators.password,
    role: validators.enum(['ADMIN', 'DRIVER', 'CLIENT']),
    phone: validators.optionalString,
    vehicle: validators.optionalString,
  }),
  asyncHandler(async (req, res) => {
    const { name, email, password, role: roleName, phone, vehicle } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      throw new ApiError(409, 'Ya existe un usuario con ese correo electrónico');
    }

    const roleQuery = await pool.query('SELECT id FROM roles WHERE name = $1', [roleName.toUpperCase()]);
    if (roleQuery.rows.length === 0) {
      throw new ApiError(400, 'Rol inválido');
    }
    const roleId = roleQuery.rows[0].id;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, name, phone, role_id, active)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         RETURNING id, email, name, phone, role_id, active, created_at`,
        [email, passwordHash, name, phone || null, roleId]
      );
      const newUser = userRes.rows[0];

      if (roleName.toUpperCase() === 'DRIVER') {
        await client.query(
          `INSERT INTO delivery_drivers (user_id, vehicle, active) VALUES ($1, $2, TRUE)`,
          [newUser.id, vehicle || 'Furgón']
        );
      } else if (roleName.toUpperCase() === 'CLIENT') {
        await client.query(
          `INSERT INTO customers (user_id) VALUES ($1)`,
          [newUser.id]
        );
      }

      await client.query('COMMIT');

      logger.info('USER_CREATED_BY_ADMIN', {
        userId: newUser.id,
        email: newUser.email,
        role: roleName,
        by: req.user.email,
      }, req.user.id);

      res.status(201).json({
        user: {
          ...newUser,
          role: roleName.toUpperCase(),
        },
        message: 'Usuario creado exitosamente',
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  })
);

// PATCH /api/users/:id - Update user details or active status (Admin only)
router.patch(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { name, phone, active, role: roleName } = req.body;

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      values.push(name);
      updates.push(`name = $${values.length}`);
    }
    if (phone !== undefined) {
      values.push(phone);
      updates.push(`phone = $${values.length}`);
    }
    if (active !== undefined) {
      values.push(active);
      updates.push(`active = $${values.length}`);
    }
    if (roleName !== undefined) {
      const r = await pool.query('SELECT id FROM roles WHERE name = $1', [roleName.toUpperCase()]);
      if (r.rows.length > 0) {
        values.push(r.rows[0].id);
        updates.push(`role_id = $${values.length}`);
      }
    }

    if (updates.length > 0) {
      values.push(id);
      await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length}`,
        values
      );
    }

    logger.info('USER_UPDATED_BY_ADMIN', { targetUserId: id, updates, by: req.user.email }, req.user.id);

    const updated = await pool.query(
      `SELECT u.id, u.email, u.name, u.phone, u.active, r.name as role
         FROM users u
         JOIN roles r ON r.id = u.role_id
        WHERE u.id = $1`,
      [id]
    );

    res.json({ user: updated.rows[0], message: 'Usuario actualizado' });
  })
);

export default router;
