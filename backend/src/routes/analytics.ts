import { logger } from '../services/logger.js';
import { Router, Request, Response } from 'express';
import {
  recordPageView,
  listAnalytics,
} from '../repositories/analyticsRepository.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.post(
  '/page-view',
  async (
    req: Request<
      Record<string, string>,
      unknown,
      { page?: unknown; analyticsConsent?: unknown }
    >,
    res: Response
  ) => {
    try {
      const { page } = req.body;
      if (req.body.analyticsConsent !== true)
        return res
          .status(403)
          .json({
            success: false,
            error: { message: 'Consentimento de análise necessário' },
          });

      if (!page) {
        return res.status(400).json({
          success: false,
          error: { message: 'Página é obrigatória' },
        });
      }

      const analyticsData = {
        page: String(page).split(/[?#]/)[0].slice(0, 200),
        timestamp: new Date(),
        createdAt: new Date(),
      };

      await recordPageView(analyticsData);

      res.status(201).json({
        success: true,
        message: 'Visualização registrada',
      });
    } catch (error) {
      logger.error('Erro ao registrar visualização:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao registrar visualização' },
      });
    }
  }
);

router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const analytics = await listAnalytics(
      startDate as string | undefined,
      endDate as string | undefined
    );

    const pageViews = analytics.reduce<Record<string, number>>((acc, item) => {
      const page = typeof item.page === 'string' ? item.page : 'unknown';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalViews: analytics.length,
        pageViews,
        analytics,
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar estatísticas' },
    });
  }
});

export default router;
