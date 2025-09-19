import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { generalRateLimit } from './middleware/rateLimiter.js';
import { securityLoggerMiddleware, suspiciousActivityDetector } from './middleware/securityLogger.js';
import routes from './routes/index.js';
import './config/firebase.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(corsMiddleware);
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middlewares de segurança
app.use(suspiciousActivityDetector);
app.use(securityLoggerMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rate limiting geral para todas as APIs
app.use('/api', generalRateLimit);
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export default app;


