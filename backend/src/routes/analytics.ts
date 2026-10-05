import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import type { DocumentData, Query } from 'firebase-admin/firestore';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.post('/page-view', async (req: Request, res: Response) => {
  try {
    const { page } = req.body;
    if (req.body.analyticsConsent !== true) return res.status(403).json({ success: false, error: { message: 'Consentimento de análise necessário' } });

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

    await db.collection('analytics').add(analyticsData);

    res.status(201).json({
      success: true,
      message: 'Visualização registrada',
    });
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao registrar visualização' },
    });
  }
});

router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let query: Query<DocumentData> = db.collection('analytics');

    if (startDate) {
      query = query.where('timestamp', '>=', new Date(startDate as string));
    }

    if (endDate) {
      query = query.where('timestamp', '<=', new Date(endDate as string));
    }

    const snapshot = await query.get();
    const analytics: Array<DocumentData & { id: string }> = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

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
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar estatísticas' },
    });
  }
});

export default router;
