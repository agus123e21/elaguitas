import { Router } from 'express';
import { processDueSubscriptions } from '../subscriptions/subscriptions.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Endpoint invocado por Vercel Cron (o cualquier programador de tareas externo)
router.get(
  '/subscriptions',
  asyncHandler(async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;

    // Si se configuró CRON_SECRET en las variables de entorno, validamos el token enviado por Vercel
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'No autorizado para ejecutar la tarea cron de suscripciones',
        },
      });
    }

    const result = await processDueSubscriptions();

    res.json({
      ok: true,
      message: 'Proceso de suscripciones ejecutado correctamente',
      timestamp: new Date().toISOString(),
      ...result,
    });
  })
);

export default router;
