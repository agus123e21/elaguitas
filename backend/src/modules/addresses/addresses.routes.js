import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateMiddleware, validators } from '../../utils/validate.js';
import { requireClient } from '../../middlewares/auth.js';
import {
  listCustomerAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from './addresses.service.js';
import { getCustomerIdByUserId } from '../orders/orders.service.js';

const router = Router();

const addressRules = {
  label: validators.optionalString,
  street: validators.requiredString,
  city: validators.optionalString,
  lat: (v) => v === undefined || v === null || (validators.number(v) && v >= -90 && v <= 90),
  lng: (v) => v === undefined || v === null || (validators.number(v) && v >= -180 && v <= 180),
  deliveryZoneId: (v) => v === undefined || v === null || validators.number(v),
  isPrimary: (v) => v === undefined || validators.boolean(v),
};

router.get(
  '/',
  requireClient,
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const addresses = await listCustomerAddresses(customerId);
    res.json({ addresses });
  })
);

router.post(
  '/',
  requireClient,
  validateMiddleware(addressRules),
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const address = await createAddress(customerId, req.body);
    res.status(201).json({ address });
  })
);

router.put(
  '/:id',
  requireClient,
  validateMiddleware(addressRules),
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const address = await updateAddress(Number(req.params.id), customerId, req.body);
    res.json({ address });
  })
);

router.delete(
  '/:id',
  requireClient,
  asyncHandler(async (req, res) => {
    const customerId = await getCustomerIdByUserId(req.user.id);
    if (!customerId) {
      return res.status(403).json({ error: { code: 403, message: 'No sos cliente registrado' } });
    }
    const result = await deleteAddress(Number(req.params.id), customerId);
    res.json(result);
  })
);

export default router;
