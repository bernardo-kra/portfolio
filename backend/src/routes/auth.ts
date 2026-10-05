import { accountRateLimit } from '../middleware/accountRateLimiter.js';
import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import { authRateLimit } from '../middleware/rateLimiter.js';
import { createSession, revokeSession } from '../services/sessionService.js';
import { verifyToken, type AuthenticatedRequest } from '../middleware/auth.js';
import googleRoutes from './googleAuth.js';

const router = Router();
router.use('/google', googleRoutes);
router.post('/logout', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  try {
    if (token) await revokeSession(token);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
});

router.post('/register', authRateLimit, (_req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    error: {
      code: 'EMAIL_VERIFICATION_REQUIRED',
      message:
        'Crie sua conta com Google. Cadastro por senha aguarda confirmação de email.',
    },
  });
});

router.post(
  '/login',
  authRateLimit,
  accountRateLimit,
  async (req: Request, res: Response) => {
    try {
      const email =
        typeof req.body.email === 'string'
          ? req.body.email.trim().toLowerCase()
          : '';
      const { password } = req.body;

      if (
        email.length > 254 ||
        !/^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(email) ||
        typeof password !== 'string' ||
        !password ||
        Buffer.byteLength(password, 'utf8') > 72
      ) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email e senha são obrigatórios' },
        });
      }

      const userRef = db.collection('users').doc(email);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(401).json({
          success: false,
          error: { message: 'Credenciais inválidas' },
        });
      }

      const userData = userDoc.data();
      if (!userData) {
        return res.status(401).json({
          success: false,
          error: { message: 'Credenciais inválidas' },
        });
      }

      // Administrative accounts must not keep using historical default/short passwords.
      const isValidPassword =
        !(userData.role === 'admin' && password.length < 16) &&
        typeof userData.password === 'string' &&
        (await bcrypt.compare(password, userData.password));

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: { message: 'Credenciais inválidas' },
        });
      }

      const token = await createSession(userData.email);

      res.json({
        success: true,
        data: {
          token,
          user: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            role: userData.role,
            isChatOwner: false,
          },
        },
        message: 'Login realizado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao fazer login' },
      });
    }
  }
);

router.get(
  '/profile/:email',
  verifyToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const email = String(req.params.email);

      if (req.user?.email !== email && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: { message: 'Acesso negado' },
        });
      }

      const userRef = db.collection('users').doc(email);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          error: { message: 'Usuário não encontrado' },
        });
      }

      const userData = userDoc.data();
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: { message: 'Usuário não encontrado' },
        });
      }

      const profile = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      };

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao buscar perfil' },
      });
    }
  }
);

export default router;
