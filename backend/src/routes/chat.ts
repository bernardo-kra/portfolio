import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { verifyToken } from '../middleware/auth.js';
import {
  messageRateLimit,
  loadMessagesRateLimit,
} from '../middleware/rateLimiter.js';

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface ChatRecord {
  id?: string;
  message?: string;
  senderEmail: string;
  senderName?: string;
  recipientEmail?: string;
  replyTo?: string;
  isAdmin?: boolean;
  read?: boolean;
  timestamp?: unknown;
}

const router = Router();

router.post(
  '/send',
  messageRateLimit,
  verifyToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { message, recipientEmail } = req.body;
      const user = req.user!;

      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          error: { message: 'Mensagem é obrigatória' },
        });
      }

      const sanitizedMessage = message.trim().substring(0, 1000);

      let targetRecipient: string | null = null;

      if (user.role === 'admin') {
        targetRecipient = recipientEmail || null;
      } else {
        targetRecipient = 'bernardo@kraczkowski.com';
      }

      const chatData = {
        message: sanitizedMessage,
        senderEmail: user.email,
        senderName: `${user.firstName} ${user.lastName}`,
        recipientEmail: targetRecipient,
        isAdmin: user.role === 'admin',
        timestamp: new Date(),
        read: false,
      };

      const chatRef = await db.collection('chats').add(chatData);

      const messageResponse = {
        id: chatRef.id,
        ...chatData,
      };

      res.status(201).json({
        success: true,
        data: messageResponse,
        message: 'Mensagem enviada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao enviar mensagem' },
      });
    }
  }
);

router.get(
  '/user/:email',
  loadMessagesRateLimit,
  verifyToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email } = req.params;
      const user = req.user!;
      const adminEmail = 'bernardo@kraczkowski.com';

      if (user.role !== 'admin' && user.email !== email) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Acesso negado: você só pode ver suas próprias mensagens',
          },
        });
      }

      const chatsQuery = db.collection('chats').orderBy('timestamp', 'asc');

      const snapshot = await chatsQuery.get();
      const messages: ChatRecord[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ChatRecord));

      const conversationMessages = messages.filter(
        msg =>
          (msg.senderEmail === email && msg.recipientEmail === adminEmail) ||
          (msg.senderEmail === adminEmail && msg.recipientEmail === email) ||
          (msg.senderEmail === email && !msg.recipientEmail) ||
          (msg.senderEmail === adminEmail && msg.replyTo === email)
      );

      res.json({
        success: true,
        data: conversationMessages,
      });
    } catch (error) {
      console.error('Erro ao buscar mensagens do usuário:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao buscar mensagens' },
      });
    }
  }
);

router.get(
  '/all',
  loadMessagesRateLimit,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { limit = 100, offset = 0 } = req.query;

      const chatsQuery = db
        .collection('chats')
        .orderBy('timestamp', 'desc')
        .limit(Number(limit))
        .offset(Number(offset));

      const snapshot = await chatsQuery.get();
      const messages: ChatRecord[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ChatRecord));

      const messagesByUser: Record<string, ChatRecord[]> = {};
      messages.forEach(msg => {
        if (!messagesByUser[msg.senderEmail]) {
          messagesByUser[msg.senderEmail] = [];
        }
        messagesByUser[msg.senderEmail].push(msg);
      });

      res.json({
        success: true,
        data: {
          messages,
          messagesByUser,
          total: messages.length,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar todas as mensagens:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao buscar mensagens' },
      });
    }
  }
);

router.put(
  '/mark-read/:messageId',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const messageId = String(req.params.messageId);

      await db.collection('chats').doc(messageId).update({
        read: true,
        readAt: new Date(),
      });

      res.json({
        success: true,
        message: 'Mensagem marcada como lida',
      });
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao marcar mensagem como lida' },
      });
    }
  }
);

router.post('/reply', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { originalMessageId, reply, adminEmail, adminName } = req.body;

    if (!originalMessageId || !reply || !adminEmail || !adminName) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            'ID da mensagem original, resposta, email e nome do admin são obrigatórios',
        },
      });
    }

    const originalMessageDoc = await db
      .collection('chats')
      .doc(originalMessageId)
      .get();

    if (!originalMessageDoc.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Mensagem original não encontrada' },
      });
    }

    const originalMessage = originalMessageDoc.data();
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        error: { message: 'Mensagem original não encontrada' },
      });
    }

    const replyData = {
      message: reply,
      senderEmail: adminEmail,
      senderName: adminName,
      isAdmin: true,
      timestamp: new Date(),
      read: false,
      originalMessageId,
      replyTo: originalMessage.senderEmail,
    };

    const replyRef = await db.collection('chats').add(replyData);

    await db.collection('chats').doc(originalMessageId).update({
      replied: true,
      repliedAt: new Date(),
    });

    const replyResponse = {
      id: replyRef.id,
      ...replyData,
    };

    res.status(201).json({
      success: true,
      data: replyResponse,
      message: 'Resposta enviada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao responder mensagem:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao responder mensagem' },
    });
  }
});

router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('chats').get();
    const messages = snapshot.docs.map(doc => doc.data() as ChatRecord);

    const stats = {
      totalMessages: messages.length,
      unreadMessages: messages.filter(msg => !msg.read).length,
      adminMessages: messages.filter(msg => msg.isAdmin).length,
      userMessages: messages.filter(msg => !msg.isAdmin).length,
      uniqueUsers: [...new Set(messages.map(msg => msg.senderEmail))]
        .length,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de chat:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar estatísticas' },
    });
  }
});

export default router;
