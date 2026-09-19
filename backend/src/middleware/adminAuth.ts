import type { NextFunction, Response } from 'express';
import {
  authenticateRequest,
  type AuthenticatedRequest,
} from './auth.js';

export const requireAdmin = async (
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

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Acesso restrito a administradores' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro na verificação de administrador:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro interno do servidor' },
    });
  }
};
