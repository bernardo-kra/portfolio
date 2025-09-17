import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { verifyToken } from '../middleware/auth.js';
import { messageRateLimit, loadMessagesRateLimit } from '../middleware/rateLimiter.js';

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const router = Router();

// Enviar mensagem (usuários comuns e admin) - REQUER AUTENTICAÇÃO + RATE LIMIT
router.post('/send', messageRateLimit, verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, recipientEmail } = req.body;
    const user = req.user!; // Garantido pelo middleware

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Mensagem é obrigatória' },
      });
    }

    // Sanitizar mensagem
    const sanitizedMessage = message.trim().substring(0, 1000); // Limite de 1000 caracteres

    // Determinar destinatário baseado no papel do usuário
    let targetRecipient: string | null = null;
    
    if (user.role === 'admin') {
      // Admin pode enviar para usuário específico
      targetRecipient = recipientEmail || null;
    } else {
      // Usuários comuns sempre enviam para admin
      targetRecipient = 'bernardo@kraczkowski.com';
    }

    const chatData = {
      message: sanitizedMessage,
      senderEmail: user.email, // SEMPRE do token autenticado
      senderName: `${user.firstName} ${user.lastName}`, // SEMPRE do token autenticado
      recipientEmail: targetRecipient,
      isAdmin: user.role === 'admin',
      timestamp: new Date(),
      read: false,
    };

    const chatRef = await db.collection('chats').add(chatData);

    res.status(201).json({
      success: true,
      data: {
        id: chatRef.id,
        ...chatData,
      },
      message: 'Mensagem enviada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao enviar mensagem' },
    });
  }
});

// Buscar mensagens do usuário (conversa com admin) - REQUER AUTENTICAÇÃO + RATE LIMIT
router.get('/user/:email', loadMessagesRateLimit, verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email } = req.params;
    const user = req.user!; // Garantido pelo middleware
    const adminEmail = 'bernardo@kraczkowski.com';

    // Verificar se o usuário pode acessar essas mensagens
    if (user.role !== 'admin' && user.email !== email) {
      return res.status(403).json({
        success: false,
        error: { message: 'Acesso negado: você só pode ver suas próprias mensagens' }
      });
    }

    // Buscar todas as mensagens e filtrar no código
    const chatsQuery = db.collection('chats')
      .orderBy('timestamp', 'asc');

    const snapshot = await chatsQuery.get();
    const messages = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtrar apenas mensagens da conversa entre usuário e admin
    const conversationMessages = messages.filter((msg: any) => 
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
});

// Buscar todas as mensagens (apenas admin) - RATE LIMIT
router.get('/all', loadMessagesRateLimit, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const chatsQuery = db.collection('chats')
      .orderBy('timestamp', 'desc')
      .limit(Number(limit))
      .offset(Number(offset));

    const snapshot = await chatsQuery.get();
    const messages = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Agrupar mensagens por usuário
    const messagesByUser: { [key: string]: any[] } = {};
    messages.forEach((msg: any) => {
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
});

// Marcar mensagem como lida (apenas admin)
router.put('/mark-read/:messageId', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

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
});

// Responder mensagem (apenas admin)
router.post('/reply', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { originalMessageId, reply, adminEmail, adminName } = req.body;

    if (!originalMessageId || !reply || !adminEmail || !adminName) {
      return res.status(400).json({
        success: false,
        error: { message: 'ID da mensagem original, resposta, email e nome do admin são obrigatórios' },
      });
    }

    // Buscar a mensagem original
    const originalMessageDoc = await db.collection('chats').doc(originalMessageId).get();
    
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

    // Criar resposta
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

    // Marcar mensagem original como respondida
    await db.collection('chats').doc(originalMessageId).update({
      replied: true,
      repliedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: {
        id: replyRef.id,
        ...replyData,
      },
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

// Estatísticas de chat (apenas admin)
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('chats').get();
    const messages = snapshot.docs.map((doc: any) => doc.data());

    const stats = {
      totalMessages: messages.length,
      unreadMessages: messages.filter((msg: any) => !msg.read).length,
      adminMessages: messages.filter((msg: any) => msg.isAdmin).length,
      userMessages: messages.filter((msg: any) => !msg.isAdmin).length,
      uniqueUsers: [...new Set(messages.map((msg: any) => msg.senderEmail))].length,
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
