import { createHash, randomBytes } from 'node:crypto';
import { db } from '../config/firebase.js';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

const readExpiration = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (value && typeof value === 'object' && 'toDate' in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === 'function') return toDate.call(value) as Date;
  }
  return null;
};

export const createSession = async (email: string): Promise<string> => {
  const token = randomBytes(32).toString('base64url');
  await db.collection('sessions').doc(hashToken(token)).set({
    email,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    createdAt: new Date(),
  });
  return token;
};

export const getSessionEmail = async (token: string): Promise<string | null> => {
  if (token.length < 32) return null;

  const sessionRef = db.collection('sessions').doc(hashToken(token));
  const sessionDoc = await sessionRef.get();
  if (!sessionDoc.exists) return null;

  const session = sessionDoc.data();
  const email = session?.email;
  const expiresAt = readExpiration(session?.expiresAt);

  if (typeof email !== 'string' || !expiresAt || expiresAt.getTime() <= Date.now()) {
    await sessionRef.delete();
    return null;
  }

  return email;
};
