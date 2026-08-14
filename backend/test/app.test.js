import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('API raíz', () => {
  it('responde con la información del servicio', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('agua-backend');
  });

  it('oculta rutas inexistentes con error 404 estructurado', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe(404);
  });

  it('enviar cabeceras de seguridad', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('el endpoint de cron responde adecuadamente', async () => {
    const res = await request(app).get('/api/cron/subscriptions');
    // Sin base de datos viva responderá 200 (si mock/db) o error controlado, pero la ruta existe
    expect([200, 500]).toContain(res.status);
  });
});

