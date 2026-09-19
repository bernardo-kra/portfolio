import type { NextFunction, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { getSessionEmail } from '../services/sessionService.js';

export interface AuthenticatedUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const getBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim() || null;
};

export const authenticateRequest = async (
  req: Request
): Promise<AuthenticatedUser | null> => {
  const token = getBearerToken(req);
  if (!token) return null;

  const email = await getSessionEmail(token);
  if (!email) return null;

  const claimedEmail = req.headers['x-user-email'];
  if (typeof claimedEmail === 'string' && claimedEmail !== email) return null;

  const userDoc = await db.collection('users').doc(email).get();
  const userData = userDoc.data();
  if (!userDoc.exists || !userData) return null;

  return {
    email,
    firstName: String(userData.firstName ?? ''),
    lastName: String(userData.lastName ?? ''),
    role: String(userData.role ?? 'user'),
  };
};

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Sessão inválida ou expirada' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro na verificação da sessão:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Sessão inválida' },
    });
  }
};
