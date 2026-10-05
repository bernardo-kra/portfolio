import type { Response } from 'express';
import { db } from '../config/firebase.js';
import {
  authenticateRequest,
  type AuthenticatedRequest,
} from '../middleware/auth.js';

// The browser receives invalidations only; message access remains in protected HTTP routes.
export function streamChatEvents(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;
  let closed = false;
  let unsubscribe: (() => void) | undefined;
  let checking = false;
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let validation: ReturnType<typeof setInterval> | undefined;
  const close = () => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    clearInterval(validation);
    unsubscribe?.();
    res.end();
  };
  const write = (frame: string) => {
    if (!closed && !res.write(frame)) close();
  };
  res.status(200).set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store, no-transform',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.on('close', close);
  write(': connected\n\n');
  try {
    unsubscribe = db
      .collection('chatActivity')
      .doc(user.email)
      .onSnapshot(() => write('data: {"type":"refresh"}\n\n'), close);
    if (closed) {
      unsubscribe();
      return;
    }
    heartbeat = setInterval(() => write(': heartbeat\n\n'), 15_000);
    // Revoked/expired sessions and changed ownership close existing connections too.
    validation = setInterval(async () => {
      if (closed || checking) return;
      checking = true;
      try {
        const current = await authenticateRequest(req);
        if (
          !current ||
          current.email !== user.email ||
          current.isChatOwner !== user.isChatOwner
        )
          close();
      } catch {
        close();
      } finally {
        checking = false;
      }
    }, 30_000);
  } catch {
    close();
  }
}
