import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateMiddleware, validators } from '../../utils/validate.js';
import { requireClient } from '../../middlewares/auth.js';
import { getCustomerIdByUserId } from '../orders/orders.service.js';
import {
  listSubscriptions,
  createSubscription,
  updateSubscription,
} from './subscriptions.service.js';

const router = Router();

router.use(
  requireClient,
  asyncHandler(async (req, res, next) => {
    req.customerId = await getCustomerIdByUserId(req.user.id);
    if (!req.customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    next();
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const subscriptions = await listSubscriptions(req.customerId);
    res.json({ subscriptions });
  })
);

router.post(
  '/',
  validateMiddleware({
    addressId: validators.number,
    productId: validators.number,
    quantity: (v) => validators.number(v) && v > 0,
    frequencyDays: validators.number,
  }),
  asyncHandler(async (req, res) => {
    const subscription = await createSubscription({ customerId: req.customerId, ...req.body });
    res.status(201).json({ subscription });
  })
);

router.patch(
  '/:id',
  validateMiddleware({
    status: validators.optionalString,
    quantity: (v) => v === undefined || (validators.number(v) && v > 0),
    frequencyDays: (v) => v === undefined || validators.number(v),
    nextDeliveryDate: validators.optionalString,
  }),
  asyncHandler(async (req, res) => {
    const subscription = await updateSubscription(Number(req.params.id), req.customerId, req.body);
    res.json({ subscription });
  })
);

export default router;
