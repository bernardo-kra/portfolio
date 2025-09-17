import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.post('/page-view', async (req: Request, res: Response) => {
  try {
    const { page, timestamp, userAgent, referrer } = req.body;

    if (!page) {
      return res.status(400).json({
        success: false,
        error: { message: 'Página é obrigatória' },
      });
    }

    const analyticsData = {
      page,
      timestamp: timestamp || new Date(),
      userAgent: userAgent || req.get('User-Agent'),
      referrer: referrer || req.get('Referer'),
      ip: req.ip,
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

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let query: any = db.collection('analytics');

    if (startDate) {
      query = query.where('timestamp', '>=', new Date(startDate as string));
    }

    if (endDate) {
      query = query.where('timestamp', '<=', new Date(endDate as string));
    }

    const snapshot = await query.get();
    const analytics = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const pageViews = analytics.reduce((acc: any, item: any) => {
      acc[item.page] = (acc[item.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
