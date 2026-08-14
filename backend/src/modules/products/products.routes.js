import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateMiddleware, validators } from '../../utils/validate.js';
import { requireAdmin } from '../../middlewares/auth.js';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} from './products.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagen no permitido (JPG, PNG, WEBP)'));
    }
  },
});

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const includeInactive = req.query.all === 'true' && req.user?.role === 'ADMIN';
    const products = await listProducts({ includeInactive });
    res.json({ products });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await getProductById(Number(req.params.id));
    res.json({ product });
  })
);

const productRules = {
  name: validators.requiredString,
  description: validators.optionalString(2000),
  price: validators.positiveNumber,
  image: validators.optionalString(500),
  stock: (v) => v === undefined || (validators.integer(v) && v >= 0),
};

router.post(
  '/',
  requireAdmin,
  validateMiddleware(productRules),
  asyncHandler(async (req, res) => {
    const product = await createProduct(req.body);
    res.status(201).json({ product });
  })
);

router.put(
  '/:id',
  requireAdmin,
  validateMiddleware(productRules),
  asyncHandler(async (req, res) => {
    const product = await updateProduct(Number(req.params.id), req.body);
    res.json({ product });
  })
);

router.patch(
  '/:id',
  requireAdmin,
  validateMiddleware({
    name: validators.optionalString,
    description: validators.optionalString(2000),
    price: (v) => v === undefined || validators.positiveNumber(v),
    image: validators.optionalString(500),
    stock: (v) => v === undefined || (validators.integer(v) && v >= 0),
    active: (v) => v === undefined || validators.boolean(v),
  }),
  asyncHandler(async (req, res) => {
    const product = await updateProduct(Number(req.params.id), req.body);
    res.json({ product });
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const product = await softDeleteProduct(Number(req.params.id));
    res.json({ product });
  })
);

router.post(
  '/upload-image',
  requireAdmin,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: { code: 400, message: 'Imagen requerida' } });
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  },
  (err, _req, res, _next) => {
    res.status(400).json({ error: { code: 400, message: err.message } });
  }
);

export default router;
