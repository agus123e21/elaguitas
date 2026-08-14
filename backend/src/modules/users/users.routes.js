import { Router } from 'express';
import pool from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { role } = req.query;
    const params = [];
    let roleFilter = '';
    if (role) {
      params.push(role);
      roleFilter = 'AND r.name = $1';
    }

    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.name, u.phone, u.active, r.name AS role,
              c.id AS customer_id, d.id AS driver_id
         FROM users u
         JOIN roles r ON r.id = u.role_id
         LEFT JOIN customers c ON c.user_id = u.id
         LEFT JOIN delivery_drivers d ON d.user_id = u.id
        WHERE u.active = TRUE ${roleFilter}
        ORDER BY u.name`,
      params
    );
    res.json({ users: rows });
  })
);

export default router;
