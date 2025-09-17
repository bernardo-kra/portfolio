import { Request, Response, NextFunction } from 'express';

interface SecurityEvent {
  timestamp: Date;
  type: 'RATE_LIMIT' | 'AUTH_FAILURE' | 'SUSPICIOUS_ACTIVITY' | 'UNAUTHORIZED_ACCESS';
  ip: string;
  userAgent: string;
  userEmail?: string;
  endpoint: string;
  details: string;
}

class SecurityLogger {
  private static instance: SecurityLogger;
  private logs: SecurityEvent[] = [];

  private constructor() {}

  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  public log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    this.logs.push(securityEvent);
    
    // Log no console para monitoramento
    console.warn(`🚨 SECURITY EVENT [${event.type}]:`, {
      timestamp: securityEvent.timestamp.toISOString(),
      ip: event.ip,
      userEmail: event.userEmail || 'N/A',
      endpoint: event.endpoint,
      details: event.details
    });

    // Manter apenas os últimos 1000 logs em memória
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  public getLogs(limit: number = 50): SecurityEvent[] {
    return this.logs.slice(-limit);
  }

  public getLogsByType(type: SecurityEvent['type'], limit: number = 50): SecurityEvent[] {
    return this.logs
      .filter(log => log.type === type)
      .slice(-limit);
  }

  public getLogsByIP(ip: string, limit: number = 50): SecurityEvent[] {
    return this.logs
      .filter(log => log.ip === ip)
      .slice(-limit);
  }
}

export const securityLogger = SecurityLogger.getInstance();

// Middleware para logar tentativas suspeitas
export const securityLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log de tentativas de acesso não autorizado
    if (res.statusCode === 401 || res.statusCode === 403) {
      securityLogger.log({
        type: 'UNAUTHORIZED_ACCESS',
        ip: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        userEmail: req.headers['x-user-email'] as string,
        endpoint: req.path,
        details: `Status: ${res.statusCode}, Method: ${req.method}`
      });
    }

    // Log de rate limiting
    if (res.statusCode === 429) {
      securityLogger.log({
        type: 'RATE_LIMIT',
        ip: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        userEmail: req.headers['x-user-email'] as string,
        endpoint: req.path,
        details: `Rate limit excedido para ${req.path}`
      });
    }

    return originalSend.call(this, data);
  };

  next();
};

// Middleware para detectar atividade suspeita
export const suspiciousActivityDetector = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip || 'unknown';
  
  // Detectar user agents suspeitos
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious) {
    securityLogger.log({
      type: 'SUSPICIOUS_ACTIVITY',
      ip,
      userAgent,
      userEmail: req.headers['x-user-email'] as string,
      endpoint: req.path,
      details: `User agent suspeito detectado: ${userAgent}`
    });
  }

  next();
};



