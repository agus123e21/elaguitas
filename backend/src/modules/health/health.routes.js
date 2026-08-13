import { Router } from 'express';
import { checkConnection } from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (req, res) => {
    let db = 'disconnected';
    try {
      await checkConnection();
      db = 'connected';
    } catch {
      db = 'unreachable';
    }

    const healthy = db === 'connected';
    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'degraded',
      service: 'agua-backend',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db,
    });
  })
);

export default router;
