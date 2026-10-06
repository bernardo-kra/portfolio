import { logger } from '../services/logger.js';
import { Request, Response, type NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) return next(err);
  const statusCode =
    err.statusCode || (err as AppError & { status?: number }).status || 500;
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message || 'Erro interno do servidor'
      : statusCode === 413
        ? 'Requisição muito grande'
        : 'Não foi possível concluir a requisição';

  logger.error('Erro:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Rota ${req.originalUrl} não encontrada`,
    },
  });
};
