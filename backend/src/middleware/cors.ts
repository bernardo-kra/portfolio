import { logger } from '../services/logger.js';
import cors from 'cors';

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Permitir requisições sem origin (ex: mobile apps, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:5173', 'http://localhost:3000']
        : []),
      'https://bernardo-kra.github.io',
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:5174']
        : []),
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

export const corsMiddleware = cors(corsOptions);
