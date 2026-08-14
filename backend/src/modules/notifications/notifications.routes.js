import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAnyRole } from '../../middlewares/auth.js';
import pool from '../../config/db.js';

const router = Router();

router.use(requireAnyRole);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    const { rows: unreadRows } = await pool.query(
      `SELECT COUNT(*)::int AS unread FROM notifications WHERE user_id = $1 AND read = FALSE`,
      [req.user.id]
    );
    res.json({ notifications: rows, unread: unreadRows[0].unread });
  })
);

router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *`,
      [Number(req.params.id), req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: { code: 404, message: 'Notificación no encontrada' } });
    }
    res.json({ notification: rows[0] });
  })
);

router.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    await pool.query(
      `UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE`,
      [req.user.id]
    );
    res.json({ ok: true });
  })
);

export default router;
