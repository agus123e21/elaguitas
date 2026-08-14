import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateMiddleware } from '../../utils/validate.js';
import { validators } from '../../utils/validate.js';
import { signToken } from '../../utils/jwt.js';
import { authenticate } from '../../middlewares/auth.js';
import {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  findUserById,
  signUser,
} from './auth.service.js';

const router = Router();

const registerRules = {
  name: validators.requiredString,
  email: validators.email,
  password: validators.password,
  phone: validators.optionalString,
};

const loginRules = {
  email: validators.email,
  password: validators.requiredString,
};

router.post(
  '/register',
  validateMiddleware(registerRules),
  asyncHandler(async (req, res) => {
    const user = await register(req.body);
    const token = signToken(signUser(user));
    res.status(201).json({ token, user });
  })
);

router.post(
  '/login',
  validateMiddleware(loginRules),
  asyncHandler(async (req, res) => {
    const user = await login(req.body.email, req.body.password);
    const token = signToken(signUser(user));
    res.json({ token, user });
  })
);

router.post(
  '/logout',
  authenticate,
  (req, res) => {
    res.json({ message: 'Sesión cerrada' });
  }
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: { code: 404, message: 'Usuario no encontrado' } });
    }
    res.json({ user });
  })
);

router.post(
  '/forgot-password',
  validateMiddleware({ email: validators.email }),
  asyncHandler(async (req, res) => {
    const { resetUrl } = await requestPasswordReset(req.body.email);
    if (!resetUrl) {
      return res.json({ message: 'Si el email existe, vas a recibir un enlace' });
    }
    console.log(`[mailer] Enlace de recuperación (dev): ${resetUrl}`);
    res.json({ message: 'Si el email existe, vas a recibir un enlace' });
  })
);

router.post(
  '/reset-password',
  validateMiddleware({ token: validators.requiredString, password: validators.password }),
  asyncHandler(async (req, res) => {
    const user = await resetPassword(req.body.token, req.body.password);
    const token = signToken(signUser(user));
    res.json({ message: 'Contraseña actualizada', token, user });
  })
);

export default router;
