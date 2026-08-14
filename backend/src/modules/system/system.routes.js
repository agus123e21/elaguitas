import { Router } from 'express';
import pool from '../../config/db.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAdmin } from '../../middlewares/auth.js';
import logger from '../../utils/logger.js';

const router = Router();

// GET /api/system/status - Live DB connection health & table counts (Admin/Dev)
router.get(
  '/status',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const start = Date.now();
    let dbStatus = {
      connected: false,
      latencyMs: null,
      version: null,
      database: null,
      tables: {},
      error: null,
    };

    try {
      const pingRes = await pool.query('SELECT version(), current_database() as db_name, NOW() as server_time');
      const latency = Date.now() - start;

      // Count main tables
      const counts = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) AS users_count,
          (SELECT COUNT(*) FROM roles) AS roles_count,
          (SELECT COUNT(*) FROM delivery_drivers) AS drivers_count,
          (SELECT COUNT(*) FROM customers) AS customers_count,
          (SELECT COUNT(*) FROM products) AS products_count,
          (SELECT COUNT(*) FROM orders) AS orders_count,
          (SELECT COUNT(*) FROM delivery_zones) AS zones_count
      `);

      dbStatus = {
        connected: true,
        latencyMs: latency,
        version: pingRes.rows[0].version.split(' ')[0] + ' ' + pingRes.rows[0].version.split(' ')[1],
        database: pingRes.rows[0].db_name,
        serverTime: pingRes.rows[0].server_time,
        tables: {
          users: Number(counts.rows[0].users_count),
          roles: Number(counts.rows[0].roles_count),
          deliveryDrivers: Number(counts.rows[0].drivers_count),
          customers: Number(counts.rows[0].customers_count),
          products: Number(counts.rows[0].products_count),
          orders: Number(counts.rows[0].orders_count),
          deliveryZones: Number(counts.rows[0].zones_count),
        },
        error: null,
      };
    } catch (err) {
      dbStatus.connected = false;
      dbStatus.error = err.message;
      logger.error('DB_HEALTH_CHECK_FAILED', { error: err.message });
    }

    res.json({
      service: 'agua-backend',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    });
  })
);

// GET /api/system/logs - System logs inspection (Admin/Dev)
router.get(
  '/logs',
  requireAdmin,
  (req, res) => {
    const { limit = 50, level } = req.query;
    const logs = logger.getLogs({ limit, level });
    res.json({ logs });
  }
);

// POST /api/system/logs/clear - Clear logs buffer (Admin/Dev)
router.post(
  '/logs/clear',
  requireAdmin,
  (req, res) => {
    logger.clear();
    logger.info('LOGS_CLEARED', { by: req.user.email }, req.user.id);
    res.json({ message: 'Logs reiniciados' });
  }
);

export default router;
