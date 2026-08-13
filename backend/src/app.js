import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env.js';
import { notFoundHandler, errorHandler } from './middlewares/error.js';
import healthRoutes from './modules/health/health.routes.js';

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: env.isProduction ? env.frontendUrl : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (!env.isProduction) {
  app.use(morgan('dev'));
}

app.use('/api', healthRoutes);

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
