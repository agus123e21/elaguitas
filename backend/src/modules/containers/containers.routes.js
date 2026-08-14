import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateMiddleware, validators } from '../../utils/validate.js';
import { requireClient, requireAdmin } from '../../middlewares/auth.js';
import { getCustomerIdByUserId } from '../orders/orders.service.js';
import {
  getCustomerSummary,
  getCustomerMovements,
  listInventory,
  registerContainers,
  updateContainerStatus,
  createMovement,
} from './containers.service.js';

const router = Router();

router.get(
  '/summary',
  requireClient,
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    res.json({ summary: await getCustomerSummary(customerId) });
  })
);

router.get(
  '/movements',
  requireClient,
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const movements = await getCustomerMovements(customerId);
    res.json({ movements });
  })
);

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const containers = await listInventory();
    res.json({ containers });
  })
);

router.post(
  '/register',
  requireAdmin,
  validateMiddleware({ quantity: (v) => validators.integer(v) && v > 0 && v <= 500 }),
  asyncHandler(async (req, res) => {
    const result = await registerContainers(req.body.quantity);
    res.status(201).json(result);
  })
);

router.patch(
  '/:id',
  requireAdmin,
  validateMiddleware({
    status: validators.enum(['IN_STOCK', 'WITH_CUSTOMER', 'DAMAGED', 'RETIRED']),
    customerId: (v) => v === undefined || v === null || validators.number(v),
  }),
  asyncHandler(async (req, res) => {
    const container = await updateContainerStatus(Number(req.params.id), req.body);
    res.json({ container });
  })
);

router.post(
  '/adjust',
  requireAdmin,
  validateMiddleware({
    customerId: validators.number,
    type: validators.enum(['DELIVERED', 'RETURNED', 'ADJUSTED']),
    quantity: (v) => validators.integer(v) && v > 0,
    notes: validators.optionalString(1000),
  }),
  asyncHandler(async (req, res) => {
    const movement = await createMovement(req.body);
    res.status(201).json({ movement });
  })
);

export default router;
