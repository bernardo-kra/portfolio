import type { Response, NextFunction } from 'express';
import { authenticateRequest, type AuthenticatedRequest } from './auth.js';

export async function requireChatOwner(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return res.status(401).json({ success: false });
    if (!user.isChatOwner) return res.status(403).json({ success: false });
    req.user = user;
    next();
  } catch {
    return res.status(503).json({ success: false });
  }
}
