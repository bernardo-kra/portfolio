import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase.js';

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token de acesso necessário' }
      });
    }

    const token = authHeader.substring(7);
    const userEmail = req.headers['x-user-email'] as string;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        error: { message: 'Email do usuário necessário' }
      });
    }

    // Verificar se o usuário existe no Firestore
    const userDoc = await db.collection('users').doc(userEmail).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: { message: 'Usuário não encontrado' }
      });
    }

    const userData = userDoc.data();
    
    if (!userData) {
      return res.status(401).json({
        success: false,
        error: { message: 'Dados do usuário inválidos' }
      });
    }

    // Adicionar dados do usuário à requisição
    req.user = {
      email: userEmail,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Token inválido' }
    });
  }
};