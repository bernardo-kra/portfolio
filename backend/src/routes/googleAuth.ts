import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../config/firebase.js';
import { authRateLimit } from '../middleware/rateLimiter.js';
import { createSession } from '../services/sessionService.js';
import {
  googleIdentity,
  canUseGoogleAccount,
} from '../services/googleIdentity.js';

const router = Router();
const verifier = new OAuth2Client();
const clientId = () => process.env.GOOGLE_CLIENT_ID;
router.post('/challenge', authRateLimit, async (_req, res) => {
  if (!clientId())
    return res
      .status(503)
      .json({ success: false, error: { code: 'GOOGLE_UNAVAILABLE' } });
  try {
    const nonce = randomBytes(32).toString('hex');
    await db
      .collection('googleChallenges')
      .doc(nonce)
      .set({ expiresAt: new Date(Date.now() + 5 * 60000) });
    return res.json({ success: true, data: { nonce } });
  } catch {
    return res
      .status(503)
      .json({ success: false, error: { code: 'GOOGLE_UNAVAILABLE' } });
  }
});
router.post('/', authRateLimit, async (req, res) => {
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
    const verifiedIdentity = identity;
    const result = await db.runTransaction(async (transaction) => {
      const challengeRef = db
        .collection('googleChallenges')
        .doc(verifiedIdentity.nonce);
      const userRef = db.collection('users').doc(verifiedIdentity.email);
      const [challenge, user] = await Promise.all([
        transaction.get(challengeRef),
        transaction.get(userRef),
      ]);
      const expiry = challenge.data()?.expiresAt?.toMillis();
      if (!expiry || expiry <= Date.now())
        return { error: 'GOOGLE_EXPIRED' } as const;
      transaction.delete(challengeRef);
      const existing = user.data();
      if (!canUseGoogleAccount(existing, verifiedIdentity.sub))
        return { error: 'GOOGLE_EXISTING_ACCOUNT' } as const;
      if (!existing)
        transaction.create(userRef, {
          email: verifiedIdentity.email,
          firstName: verifiedIdentity.firstName,
          lastName: verifiedIdentity.lastName,
          googleSub: verifiedIdentity.sub,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      return {
        user: {
          email: verifiedIdentity.email,
          firstName: existing?.firstName || verifiedIdentity.firstName,
          lastName: existing?.lastName || verifiedIdentity.lastName,
          role: existing?.role || 'user',
        },
      };
    });
    if ('error' in result)
      return res
        .status(409)
        .json({ success: false, error: { code: result.error } });
    const token = await createSession(identity.email);
    return res.json({ success: true, data: { token, user: result.user } });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: { code: 'GOOGLE_UNAVAILABLE' } });
  }
});
export default router;
