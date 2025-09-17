import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/adminAuth.js';
import { securityLogger } from '../middleware/securityLogger.js';

const router = Router();

// Rota para visualizar logs de segurança (apenas admin)
router.get('/logs', requireAdmin, (req: Request, res: Response) => {
  try {
    const { type, ip, limit = 50 } = req.query;
    
    let logs;
    
    if (type) {
      logs = securityLogger.getLogsByType(type as any, Number(limit));
    } else if (ip) {
      logs = securityLogger.getLogsByIP(ip as string, Number(limit));
    } else {
      logs = securityLogger.getLogs(Number(limit));
    }

    res.json({
      success: true,
      data: {
        logs,
        total: logs.length,
        filters: { type, ip, limit }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar logs de segurança:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar logs de segurança' }
    });
  }
});

// Rota para estatísticas de segurança (apenas admin)
router.get('/stats', requireAdmin, (req: Request, res: Response) => {
  try {
    const allLogs = securityLogger.getLogs(1000);
    
    const stats = {
      total: allLogs.length,
      byType: {
        RATE_LIMIT: allLogs.filter(log => log.type === 'RATE_LIMIT').length,
        AUTH_FAILURE: allLogs.filter(log => log.type === 'AUTH_FAILURE').length,
        SUSPICIOUS_ACTIVITY: allLogs.filter(log => log.type === 'SUSPICIOUS_ACTIVITY').length,
        UNAUTHORIZED_ACCESS: allLogs.filter(log => log.type === 'UNAUTHORIZED_ACCESS').length,
      },
      byIP: allLogs.reduce((acc, log) => {
        acc[log.ip] = (acc[log.ip] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: allLogs.slice(-10) // Últimos 10 eventos
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de segurança:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar estatísticas de segurança' }
    });
  }
});

export default router;



