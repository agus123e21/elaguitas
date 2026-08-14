import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAdmin } from '../../middlewares/auth.js';
import { getDashboard } from './dashboard.service.js';

const router = Router();

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = await getDashboard();
    res.json(data);
  })
);

export default router;
