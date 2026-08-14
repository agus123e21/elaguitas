import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateMiddleware, validators } from '../../utils/validate.js';
import { requireAdmin } from '../../middlewares/auth.js';
import {
  listPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from './promotions.service.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const includeInactive = req.query.all === 'true';
    const promotions = await listPromotions({ includeInactive });
    res.json({ promotions });
  })
);

const promotionRules = {
  name: validators.optionalString(100),
  code: validators.optionalString,
  type: validators.optionalEnum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'PACK']),
  value: validators.optionalPositiveNumber,
  packQuantity: validators.optionalPositiveNumber,
  minQuantity: validators.optionalPositiveNumber,
  minOrderAmount: validators.optionalPositiveNumber,
  active: validators.optionalBoolean,
  startsAt: validators.optionalString,
  endsAt: validators.optionalString,
};

router.post(
  '/',
  requireAdmin,
  validateMiddleware({
    name: validators.requiredString(100),
    type: validators.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'PACK']),
    ...promotionRules,
  }),
  asyncHandler(async (req, res) => {
    const promotion = await createPromotion(req.body);
    res.status(201).json({ promotion });
  })
);

router.put(
  '/:id',
  requireAdmin,
  validateMiddleware(promotionRules),
  asyncHandler(async (req, res) => {
    const promotion = await updatePromotion(Number(req.params.id), req.body);
    if (!promotion) {
      return res.status(404).json({ error: { code: 404, message: 'Promoción no encontrada' } });
    }
    res.json({ promotion });
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const deleted = await deletePromotion(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: { code: 404, message: 'Promoción no encontrada' } });
    }
    res.status(204).end();
  })
);

export default router;
