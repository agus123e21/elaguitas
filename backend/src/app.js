import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import env from './config/env.js';
import { notFoundHandler, errorHandler } from './middlewares/error.js';
import { requireClient, requireDriver, requireAdmin, requireAnyRole } from './middlewares/auth.js';
import healthRoutes from './modules/health/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import addressesRoutes from './modules/addresses/addresses.routes.js';
import zonesRoutes from './modules/zones/zones.routes.js';
import containersRoutes from './modules/containers/containers.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes.js';
import promotionsRoutes from './modules/promotions/promotions.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import cronRoutes from './modules/cron/cron.routes.js';
import systemRoutes from './modules/system/system.routes.js';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.disable('x-powered-by');

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 429, message: 'Demasiadas solicitudes, intentá más tarde' } },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 429, message: 'Demasiados intentos de acceso, intentá más tarde' } },
});

// Configuración de CORS flexible para web, Vercel preview/producción y apps móviles (Capacitor)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !env.isProduction) return callback(null, true);
      if (
        origin === env.frontendUrl ||
        origin.endsWith('.vercel.app') ||
        origin.startsWith('capacitor://') ||
        origin.startsWith('http://localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, '../uploads');
if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath));
}

if (!env.isProduction) {
  app.use(morgan('dev'));
}

const apiRouter = express.Router();
apiRouter.use(apiLimiter);
apiRouter.use(healthRoutes);
apiRouter.use('/cron', cronRoutes);
apiRouter.use('/auth', authLimiter, authRoutes);
apiRouter.use('/products', productsRoutes);
apiRouter.use('/orders', requireAnyRole, ordersRoutes);
apiRouter.use('/addresses', addressesRoutes);
apiRouter.use('/zones', zonesRoutes);
apiRouter.use('/containers', containersRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/subscriptions', subscriptionsRoutes);
apiRouter.use('/promotions', promotionsRoutes);
apiRouter.use('/notifications', notificationsRoutes);
apiRouter.use('/system', systemRoutes);

apiRouter.use('/client', requireClient, (req, res) => {
  res.json({ role: req.user.role, message: 'Área de cliente' });
});

apiRouter.use('/driver', requireDriver, (req, res) => {
  res.json({ role: req.user.role, message: 'Área de repartidor' });
});

apiRouter.use('/admin', requireAdmin, (req, res) => {
  res.json({ role: req.user.role, message: 'Área de administrador' });
});

app.use('/api', apiRouter);
app.use('/', apiRouter);

app.get(['/', '/api'], (req, res) => {
  res.json({
    service: 'agua-backend',
    message: 'API de venta y reparto de agua en bidones',
    docs: '/api/health',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
