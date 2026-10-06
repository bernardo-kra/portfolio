import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import type { Request } from 'express';
import {
  storeGoogleChallenge,
  consumeGoogleChallenge,
} from '../repositories/googleAccountRepository.js';
import {
  authRateLimit,
  googleChallengeRateLimit,
} from '../middleware/rateLimiter.js';
import { createSession } from '../services/sessionService.js';
import { googleIdentity } from '../services/googleIdentity.js';

const router = Router();
const verifier = new OAuth2Client();
const clientId = () => process.env.GOOGLE_CLIENT_ID;
router.post('/challenge', googleChallengeRateLimit, async (_req, res) => {
  if (!clientId())
    return res
      .status(503)
      .json({ success: false, error: { code: 'GOOGLE_UNAVAILABLE' } });
  try {
    const nonce = randomBytes(32).toString('hex');
    await storeGoogleChallenge(nonce);
    return res.json({ success: true, data: { nonce } });
  } catch {
    return res
      .status(503)
      .json({ success: false, error: { code: 'GOOGLE_UNAVAILABLE' } });
  }
});
router.post(
  '/',
  authRateLimit,
  async (
    req: Request<Record<string, string>, unknown, { credential?: unknown }>,
    res
  ) => {
    if (!clientId())
      return res
        .status(503)
        .json({ success: false, error: { code: 'GOOGLE_UNAVAILABLE' } });
    if (
      typeof req.body.credential !== 'string' ||
      req.body.credential.length > 10000
    )
      return res
        .status(400)
        .json({ success: false, error: { code: 'GOOGLE_INVALID' } });
    let identity;
    try {
      const ticket = await verifier.verifyIdToken({
        idToken: req.body.credential,
        audience: clientId(),
      });
      identity = googleIdentity(ticket.getPayload());
    } catch {
      return res
        .status(401)
        .json({ success: false, error: { code: 'GOOGLE_INVALID' } });
    }
    if (!identity)
      return res
        .status(401)
        .json({ success: false, error: { code: 'GOOGLE_INVALID' } });
    try {
      const result = await consumeGoogleChallenge(identity);
      if ('error' in result)
        return res
          .status(409)
          .json({ success: false, error: { code: result.error } });
      const token = await createSession(identity.email, identity.sub);
      return res.json({ success: true, data: { token, user: result.user } });
    } catch {
      return res
        .status(500)
        .json({ success: false, error: { code: 'GOOGLE_UNAVAILABLE' } });
    }
  }
);
export default router;
