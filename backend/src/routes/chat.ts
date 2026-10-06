import { Router } from 'express';
import { createHash } from 'node:crypto';
import { db } from '../config/firebase.js';
import { verifyToken, type AuthenticatedRequest } from '../middleware/auth.js';
import { requireChatOwner } from '../middleware/chatOwnerAuth.js';
import {
  messageRateLimit,
  loadMessagesRateLimit,
} from '../middleware/rateLimiter.js';
import { chatOwnerEmail, conversationEmail } from '../services/chatPolicy.js';
import type { DocumentData } from 'firebase-admin/firestore';
import { streamChatEvents } from '../services/chatEvents.js';

const router = Router();
router.get('/events', verifyToken, loadMessagesRateLimit, streamChatEvents);
const validEmail = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= 254 &&
  /^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(value);
const validMessage = (value: unknown): value is string =>
  typeof value === 'string' && !!value.trim() && value.trim().length <= 500;
const time = (value: unknown): number => {
  if (value && typeof value === 'object' && 'toMillis' in value)
    return (value as { toMillis: () => number }).toMillis();
  return value instanceof Date ? value.getTime() : 0;
};
async function readConversation(email: string) {
  // Separate equality queries preserve old messages without requiring composite indexes.
  const snapshots = await Promise.all([
    db.collection('chats').where('conversationUserEmail', '==', email).get(),
    db.collection('chats').where('senderEmail', '==', email).get(),
    db.collection('chats').where('recipientEmail', '==', email).get(),
    db.collection('chats').where('replyTo', '==', email).get(),
  ]);
  const records = new Map<string, DocumentData>();
  for (const snapshot of snapshots)
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (conversationEmail(data) === email)
        records.set(doc.id, { ...data, id: doc.id });
    }
  return [...records.values()].sort(
    (a, b) => time(a.timestamp) - time(b.timestamp)
  );
}
async function send(
  user: NonNullable<AuthenticatedRequest['user']>,
  message: string,
  email: string,
  clientMessageId?: string
) {
  const data = {
    message: message.trim(),
    senderEmail: user.email,
    senderName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    recipientEmail: user.isChatOwner ? email : chatOwnerEmail(),
    conversationUserEmail: user.isChatOwner ? email : user.email,
    isAdmin: user.isChatOwner,
    timestamp: new Date(),
    read: false,
  };
  const ref = clientMessageId
    ? db
        .collection('chats')
        .doc(
          createHash('sha256')
            .update(`${user.email}\0${clientMessageId}`)
            .digest('hex')
        )
    : db.collection('chats').doc();
  if (clientMessageId) {
    return db.runTransaction(async (transaction) => {
      const existing = await transaction.get(ref);
      if (existing.exists) {
        const saved = existing.data()!;
        if (
          saved.message !== data.message ||
          saved.conversationUserEmail !== data.conversationUserEmail ||
          saved.senderEmail !== data.senderEmail
        )
          throw new Error('MESSAGE_ID_CONFLICT');
        return { ...saved, id: ref.id };
      }
      transaction.create(ref, data);
      for (const participant of new Set([
        chatOwnerEmail(),
        data.conversationUserEmail,
      ]))
        transaction.set(db.collection('chatActivity').doc(participant), {
          messageId: ref.id,
        });
      return { id: ref.id, ...data };
    });
  }
  const batch = db.batch();
  batch.set(ref, data);
  // Atomically notify both endpoints, across backend instances, without exposing messages.
  for (const participant of new Set([
    chatOwnerEmail(),
    data.conversationUserEmail,
  ]))
    batch.set(db.collection('chatActivity').doc(participant), {
      messageId: ref.id,
    });
  await batch.commit();
  return { id: ref.id, ...data };
}

router.post(
  '/send',
  messageRateLimit,
  verifyToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const clientMessageId = req.body.clientMessageId;
      if (
        clientMessageId !== undefined &&
        (typeof clientMessageId !== 'string' ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            clientMessageId
          ))
      )
        return res.status(400).json({ success: false });
      if (!validMessage(req.body.message))
        return res.status(400).json({
          success: false,
          error: { message: 'Use uma mensagem de até 500 caracteres.' },
        });
      let recipient = user.email;
      if (user.isChatOwner) {
        if (!validEmail(req.body.recipientEmail))
          return res.status(400).json({ success: false });
        recipient = req.body.recipientEmail.trim().toLowerCase();
        if (
          recipient === chatOwnerEmail() ||
          !(await db.collection('users').doc(recipient).get()).exists
        )
          return res.status(400).json({ success: false });
      }
      // Ordinary accounts cannot select recipients or impersonate an administrator.
      return res.status(201).json({
        success: true,
        data: await send(user, req.body.message, recipient, clientMessageId),
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'MESSAGE_ID_CONFLICT')
        return res
          .status(409)
          .json({ success: false, error: { code: 'MESSAGE_ID_CONFLICT' } });
      return res.status(500).json({ success: false });
    }
  }
);

router.get(
  '/user/:email',
  loadMessagesRateLimit,
  verifyToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const email = String(req.params.email).trim().toLowerCase();
      if (!validEmail(email)) return res.status(400).json({ success: false });
      if (!req.user!.isChatOwner && req.user!.email !== email)
        return res.status(403).json({ success: false });
      return res.json({ success: true, data: await readConversation(email) });
    } catch {
      return res.status(500).json({ success: false });
    }
  }
);

router.get(
  '/all',
  loadMessagesRateLimit,
  requireChatOwner,
  async (req, res) => {
    try {
      const limit = Math.min(200, Math.max(1, Number(req.query.limit || 200)));
      const offset = Math.max(0, Number(req.query.offset || 0));
      if (!Number.isInteger(limit) || !Number.isInteger(offset))
        return res.status(400).json({ success: false });
      const snapshot = await db
        .collection('chats')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      const messagesByUser: Record<string, DocumentData[]> =
        Object.create(null);
      const messages: DocumentData[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      for (const message of messages) {
        const email = conversationEmail(message);
        if (!email || email === chatOwnerEmail()) continue;
        (messagesByUser[email] ||= []).push(message);
      }
      return res.json({
        success: true,
        data: {
          messages,
          messagesByUser,
          total: messages.length,
          hasMore: messages.length === limit,
        },
      });
    } catch {
      return res.status(500).json({ success: false });
    }
  }
);

router.put('/mark-read/:messageId', requireChatOwner, async (req, res) => {
  try {
    await db
      .collection('chats')
      .doc(String(req.params.messageId))
      .update({ read: true, readAt: new Date() });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
});

router.post('/read/:email', requireChatOwner, async (req, res) => {
  try {
    const email = String(req.params.email).trim().toLowerCase();
    if (!validEmail(email)) return res.status(400).json({ success: false });
    const unread = (await readConversation(email)).filter(
      (message) => !message.isAdmin && !message.read
    );
    for (let start = 0; start < unread.length; start += 400) {
      const batch = db.batch();
      for (const message of unread.slice(start, start + 400)) {
        batch.update(db.collection('chats').doc(message.id), {
          read: true,
          readAt: new Date(),
        });
      }
      await batch.commit();
    }
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
});

router.post(
  '/reply',
  messageRateLimit,
  requireChatOwner,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (
        typeof req.body.originalMessageId !== 'string' ||
        req.body.originalMessageId.includes('/') ||
        !validMessage(req.body.reply)
      )
        return res.status(400).json({ success: false });
      const original = await db
        .collection('chats')
        .doc(req.body.originalMessageId)
        .get();
      if (!original.exists) return res.status(404).json({ success: false });
      const recipient = conversationEmail(original.data()!);
      if (!validEmail(recipient) || recipient === chatOwnerEmail())
        return res.status(400).json({ success: false });
      return res.status(201).json({
        success: true,
        data: await send(req.user!, req.body.reply, recipient),
      });
    } catch {
      return res.status(500).json({ success: false });
    }
  }
);

router.get('/stats', requireChatOwner, async (_req, res) => {
  try {
    const snapshot = await db.collection('chats').get();
    const messages = snapshot.docs.map((doc) => doc.data());
    return res.json({
      success: true,
      data: {
        totalMessages: messages.length,
        unreadMessages: messages.filter(
          (message) => !message.isAdmin && !message.read
        ).length,
        uniqueUsers: new Set(messages.map(conversationEmail).filter(Boolean))
          .size,
      },
    });
  } catch {
    return res.status(500).json({ success: false });
  }
});
export default router;
