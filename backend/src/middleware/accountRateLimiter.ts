import { createHash } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase.js';

// Shared across instances and restarts; failures block authentication.
export async function accountRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email =
    typeof req.body?.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';
  if (!email || email.length > 254) return next();
  const key = createHash('sha256').update(email).digest('hex');
  try {
    const allowed = await db.runTransaction(async (transaction) => {
      const ref = db.collection('authAttempts').doc(key);
      const previous = (await transaction.get(ref)).data();
      const now = Date.now();
      const active = Number(previous?.resetAt) > now;
      const attempts = active ? Number(previous?.attempts || 0) : 0;
      if (attempts >= 10) return false;
      const resetAt = active ? previous!.resetAt : now + 15 * 60 * 1000;
      transaction.set(ref, {
        attempts: attempts + 1,
        resetAt,
        expiresAt: new Date(resetAt),
      });
      return true;
    });
    if (!allowed)
      return res
        .status(429)
        .json({
          success: false,
          error: { message: 'Tente novamente mais tarde.' },
        });
    next();
  } catch {
    return res
      .status(503)
      .json({
        success: false,
        error: { message: 'Login temporariamente indisponível.' },
      });
  }
}
