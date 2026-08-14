import { Router } from 'express';
import pool from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAdmin } from '../../middlewares/auth.js';
import { validateMiddleware, validators } from '../../utils/validate.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, name, price, active, created_at
         FROM delivery_zones
        WHERE $1::boolean OR active = TRUE
        ORDER BY price`,
      [req.query.all === 'true' && req.user?.role === 'ADMIN']
    );
    res.json({ zones: rows });
  })
);

router.post(
  '/',
  requireAdmin,
  validateMiddleware({
    name: validators.requiredString,
    price: validators.positiveNumber,
    area: (v) => v === undefined || Array.isArray(v),
  }),
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `INSERT INTO delivery_zones (name, price, area)
       VALUES ($1, $2, $3)
       RETURNING id, name, price, active`,
      [req.body.name, req.body.price, req.body.area ?? []]
    );
    res.status(201).json({ zone: rows[0] });
  })
);

router.patch(
  '/:id',
  requireAdmin,
  validateMiddleware({
    name: validators.optionalString,
    price: (v) => v === undefined || validators.positiveNumber(v),
    area: (v) => v === undefined || Array.isArray(v),
    active: (v) => v === undefined || validators.boolean(v),
  }),
  asyncHandler(async (req, res) => {
    const allowed = ['name', 'price', 'area', 'active'];
    const sets = [];
    const params = [];
    let i = 1;
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        sets.push(`${key} = $${i}`);
        params.push(req.body[key]);
        i += 1;
      }
    }
    if (sets.length === 0) {
      return res.status(400).json({ error: { code: 400, message: 'Sin campos para actualizar' } });
    }
    params.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE delivery_zones SET ${sets.join(', ')} WHERE id = $${i} RETURNING id, name, price, active`,
      params
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: { code: 404, message: 'Zona no encontrada' } });
    }
    res.json({ zone: rows[0] });
  })
);

export default router;
