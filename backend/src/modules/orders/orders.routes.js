import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateMiddleware, validators } from '../../utils/validate.js';
import { requireClient, requireAdmin, requireDriver, requireAnyRole } from '../../middlewares/auth.js';
import {
  createOrder,
  previewOrder,
  listOrders,
  getOrderById,
  repeatOrder,
  changeOrderStatus,
  assignDriver,
  getCustomerIdByUserId,
  getDriverIdByUserId,
} from './orders.service.js';

const router = Router();

const itemRules = {
  productId: validators.number,
  quantity: (v) => validators.number(v) && v > 0,
};

const orderRules = {
  addressId: validators.number,
  items: (v) => Array.isArray(v) && v.length > 0 && v.every((i) => !validateItem(i)),
  paymentMethod: validators.enum(['CASH', 'CARD', 'TRANSFER']),
  containersDelivered: (v) => v === undefined || (validators.integer(v) && v >= 0),
  containersReturned: (v) => v === undefined || (validators.integer(v) && v >= 0),
  notes: validators.optionalString(2000),
  promotionCode: validators.optionalString,
};

function validateItem(item) {
  let error = false;
  if (!item || typeof item !== 'object') return true;
  if (!itemRules.productId(item.productId)) error = true;
  if (!itemRules.quantity(item.quantity)) error = true;
  return error;
}

router.post(
  '/',
  requireAnyRole,
  validateMiddleware(orderRules),
  asyncHandler(async (req, res) => {
    let customerId = req.body.customerId;
    if (req.user.role === 'CLIENT') {
      customerId = await getCustomerIdByUserId(req.user.id);
      if (!customerId) {
        return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
      }
    } else if (req.user.role === 'ADMIN') {
      if (!customerId) {
        const c = await pool.query('SELECT id FROM customers LIMIT 1');
        customerId = c.rows[0]?.id;
      }
    }
    const order = await createOrder({ customerId, ...req.body });
    if (req.body.driverId) {
      await assignDriver(order.id, req.body.driverId);
    }
    res.status(201).json({ order: await getOrderById(order.id) });
  })
);

router.post(
  '/preview',
  requireClient,
  validateMiddleware({
    addressId: validators.number,
    items: (v) => Array.isArray(v) && v.length > 0 && v.every((i) => !validateItem(i)),
    promotionCode: validators.optionalString,
  }),
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const preview = await previewOrder({ customerId, ...req.body });
    res.json({ preview });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, limit = 100, offset = 0 } = req.query;
    if (req.user.role === 'ADMIN') {
      const orders = await listOrders({ status, limit: Number(limit), offset: Number(offset), role: 'ADMIN' });
      return res.json({ orders });
    }
    if (req.user.role === 'DRIVER') {
      const driverId = await getDriverIdByUserId(req.user.id);
      if (!driverId) {
        return res.status(403).json({ error: { code: 403, message: 'No sos repartidor registrado' } });
      }
      const orders = await listOrders({ driverId, status, role: 'DRIVER' });
      return res.json({ orders });
    }
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const orders = await listOrders({ customerId, status, role: 'CLIENT' });
    return res.json({ orders });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (req.user.role === 'ADMIN') {
      const order = await getOrderById(id);
      return res.json({ order });
    }
    if (req.user.role === 'DRIVER') {
      const driverId = await getDriverIdByUserId(req.user.id);
      if (!driverId) {
        return res.status(403).json({ error: { code: 403, message: 'No sos repartidor registrado' } });
      }
      const order = await getOrderById(id, { scopes: { driverId } });
      return res.json({ order });
    }
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const order = await getOrderById(id, { scopes: { customerId } });
    res.json({ order });
  })
);

router.post(
  '/:id/repeat',
  requireClient,
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const order = await repeatOrder(Number(req.params.id), customerId);
    res.status(201).json({ order });
  })
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    if (req.user.role === 'ADMIN') {
      const order = await changeOrderStatus(Number(req.params.id), req.body.status, { scope: {} });
      return res.json({ order });
    }
    if (req.user.role === 'DRIVER') {
      const driverId = await getDriverIdByUserId(req.user.id);
      if (!driverId) {
        return res.status(403).json({ error: { code: 403, message: 'No sos repartidor registrado' } });
      }
      const allowed = ['OUT_FOR_DELIVERY', 'DELIVERED'];
      if (!allowed.includes(req.body.status)) {
        return res.status(403).json({ error: { code: 403, message: 'El repartidor solo puede iniciar entrega o marcar entregado' } });
      }
      const order = await changeOrderStatus(Number(req.params.id), req.body.status, { scope: { driverId } });
      return res.json({ order });
    }
    return res.status(403).json({ error: { code: 403, message: 'No tenés permisos para cambiar estados' } });
  })
);

router.post(
  '/:id/assign-driver',
  requireAdmin,
  validateMiddleware({ driverId: validators.number }),
  asyncHandler(async (req, res) => {
    const result = await assignDriver(Number(req.params.id), req.body.driverId);
    res.json(result);
  })
);

export default router;
