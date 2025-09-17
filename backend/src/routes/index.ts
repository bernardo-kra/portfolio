import { Router } from 'express';
import portfolioRoutes from './portfolio.js';
import contactRoutes from './contact.js';
import analyticsRoutes from './analytics.js';
import authRoutes from './auth.js';
import chatRoutes from './chat.js';
import securityRoutes from './security.js';

const router = Router();

router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/security', securityRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
  });
});

export default router;
