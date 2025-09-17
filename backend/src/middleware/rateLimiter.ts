import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limiter para envio de mensagens
export const messageRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo 10 mensagens por minuto
  message: {
    success: false,
    error: { message: 'Muitas mensagens enviadas. Tente novamente em 1 minuto.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Rate limit excedido para IP: ${req.ip}, User: ${req.headers['x-user-email']}`);
    res.status(429).json({
      success: false,
      error: { message: 'Muitas mensagens enviadas. Tente novamente em 1 minuto.' }
    });
  }
});

// Rate limiter para carregamento de mensagens
export const loadMessagesRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 requisições por minuto
  message: {
    success: false,
    error: { message: 'Muitas requisições. Tente novamente em 1 minuto.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Rate limit excedido para carregamento - IP: ${req.ip}, User: ${req.headers['x-user-email']}`);
    res.status(429).json({
      success: false,
      error: { message: 'Muitas requisições. Tente novamente em 1 minuto.' }
    });
  }
});

// Rate limiter para login/registro
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por 15 minutos
  message: {
    success: false,
    error: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Rate limit excedido para autenticação - IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
    });
  }
});

// Rate limiter geral para APIs
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por 15 minutos
  message: {
    success: false,
    error: { message: 'Muitas requisições. Tente novamente em 15 minutos.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`Rate limit geral excedido - IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      success: false,
      error: { message: 'Muitas requisições. Tente novamente em 15 minutos.' }
    });
  }
});



