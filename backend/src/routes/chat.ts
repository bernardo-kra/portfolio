import { Router } from 'express';
import {
  readConversation,
  incomingVisitorMessages,
  sendMessage,
  listRecentMessages,
  markMessageRead,
  markConversationRead,
  findMessage,
  allMessageData,
  messageTime as time,
  type ChatRecord,
} from '../repositories/chatRepository.js';
import { userExists } from '../repositories/userRepository.js';
import { validReadMessageIds } from '../services/chatReadPolicy.js';
import { verifyToken, type AuthenticatedRequest } from '../middleware/auth.js';
import { requireChatOwner } from '../middleware/chatOwnerAuth.js';
import {
  messageRateLimit,
  loadMessagesRateLimit,
  chatNotificationRateLimit,
  chatReadRateLimit,
} from '../middleware/rateLimiter.js';
import { chatOwnerEmail, conversationEmail } from '../services/chatPolicy.js';
import { streamChatEvents } from '../services/chatEvents.js';

const router = Router();
router.get('/events', verifyToken, loadMessagesRateLimit, streamChatEvents);
const validEmail = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= 254 &&
  /^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(value);
const validMessage = (value: unknown): value is string =>
  typeof value === 'string' && !!value.trim() && value.trim().length <= 500;
router.get(
  '/notifications',
  verifyToken,
  chatNotificationRateLimit,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const messages = user.isChatOwner
        ? await incomingVisitorMessages()
        : await readConversation(user.email);
      const incoming = messages.filter(
        (message) =>
          !message.read &&
          (user.isChatOwner
            ? !message.isAdmin &&
              !!conversationEmail(message) &&
              conversationEmail(message) !== chatOwnerEmail()
            : message.isAdmin === true)
      );
      return res.json({
        success: true,
        data: incoming
          .sort((a, b) => time(b.timestamp) - time(a.timestamp))
          .slice(0, 100)
          .map((message) => ({
            ...message,
            conversationUserEmail: conversationEmail(message),
          })),
      });
    } catch {
      return res.status(500).json({ success: false });
    }
  }
);
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
        if (recipient === chatOwnerEmail() || !(await userExists(recipient)))
          return res.status(400).json({ success: false });
      }
      // Ordinary accounts cannot select recipients or impersonate an administrator.
      return res.status(201).json({
        success: true,
        data: await sendMessage(
          user,
          req.body.message,
          recipient,
          clientMessageId
        ),
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
      const messages = await listRecentMessages(limit, offset);
      const messagesByUser = Object.create(null) as Record<
        string,
        ChatRecord[]
      >;

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
    await markMessageRead(String(req.params.messageId));
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
});

router.post(
  '/read/:email',
  verifyToken,
  chatReadRateLimit,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const email = String(req.params.email).trim().toLowerCase();
      if (!validEmail(email)) return res.status(400).json({ success: false });
      if (!user.isChatOwner && email !== user.email)
        return res.status(403).json({ success: false });
      const ids = req.body?.messageIds;
      // Keep older owner clients compatible; visitors must identify messages they saw.
      if (!validReadMessageIds(ids, user.isChatOwner))
        return res.status(400).json({ success: false });
      const unread = (await readConversation(email)).filter(
        (message) =>
          !message.read &&
          (user.isChatOwner ? !message.isAdmin : message.isAdmin === true) &&
          (ids === undefined || ids.includes(message.id))
      );
      await markConversationRead(unread);
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ success: false });
    }
  }
);

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
      const original = await findMessage(req.body.originalMessageId);
      if (!original.exists) return res.status(404).json({ success: false });
      const recipient = conversationEmail(original.data);
      if (!validEmail(recipient) || recipient === chatOwnerEmail())
        return res.status(400).json({ success: false });
      return res.status(201).json({
        success: true,
        data: await sendMessage(req.user!, req.body.reply, recipient),
      });
    } catch {
      return res.status(500).json({ success: false });
    }
  }
);

router.get('/stats', requireChatOwner, async (_req, res) => {
  try {
    const messages = await allMessageData();
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
