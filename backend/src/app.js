import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
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

app.use(
  cors({
    origin: env.isProduction ? env.frontendUrl : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (!env.isProduction) {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);
app.use('/api', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', requireAnyRole, ordersRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/containers', containersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use('/api/client', requireClient, (req, res) => {
  res.json({ role: req.user.role, message: 'Área de cliente' });
});

app.use('/api/driver', requireDriver, (req, res) => {
  res.json({ role: req.user.role, message: 'Área de repartidor' });
});

app.use('/api/admin', requireAdmin, (req, res) => {
  res.json({ role: req.user.role, message: 'Área de administrador' });
});

app.get('/', (req, res) => {
  res.json({
    service: 'agua-backend',
    message: 'API de venta y reparto de agua en bidones',
    docs: '/api/health',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
