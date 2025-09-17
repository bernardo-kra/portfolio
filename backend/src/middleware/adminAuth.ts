import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase.js';

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token de autorização necessário' },
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Aqui você pode verificar o token Firebase se necessário
    // Por enquanto, vamos buscar o usuário pelo email no header
    const userEmail = req.headers['x-user-email'] as string;
    
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        error: { message: 'Email do usuário necessário' },
      });
    }

    const userDoc = await db.collection('users').doc(userEmail).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: { message: 'Usuário não encontrado' },
      });
    }

    const userData = userDoc.data();
    if (!userData) {
      return res.status(401).json({
        success: false,
        error: { message: 'Usuário não encontrado' },
      });
    }

    if (userData.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade' },
      });
    }

    req.user = {
      email: userData.email,
      role: userData.role,
    };

    next();
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro interno do servidor' },
    });
  }
};




