import { logger } from '../services/logger.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { Router, Request, Response } from 'express';
import {
  createContactMessage,
  listContactMessages,
  markContactMessageRead,
} from '../repositories/contactRepository.js';
import { messageRateLimit } from '../middleware/rateLimiter.js';
import { validText, validDocumentId } from '../services/inputValidation.js';

const router = Router();

router.post(
  '/messages',
  messageRateLimit,
  async (
    req: Request<
      Record<string, string>,
      unknown,
      { name?: unknown; email?: unknown; subject?: unknown; message?: unknown }
    >,
    res: Response
  ) => {
    try {
      const { name, email, subject, message } = req.body;

      if (
        !validText(name, 200) ||
        !validText(email, 254) ||
        !/^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(email) ||
        !validText(message, 5000) ||
        (subject !== undefined &&
          (typeof subject !== 'string' || subject.length > 200))
      ) {
        return res.status(400).json({
          success: false,
          error: { message: 'Nome, email e mensagem são obrigatórios' },
        });
      }

      const messageData = {
        name,
        email,
        subject: subject || '',
        message,
        createdAt: new Date(),
        read: false,
      };

      const docRef = await createContactMessage(messageData);

      res.status(201).json({
        success: true,
        data: { id: docRef.id, ...messageData },
        message: 'Mensagem enviada com sucesso!',
      });
    } catch (error) {
      logger.error('Erro ao enviar mensagem:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao enviar mensagem' },
      });
    }
  }
);

router.get('/messages', requireAdmin, async (req: Request, res: Response) => {
  try {
    const messages = await listContactMessages();

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    logger.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar mensagens' },
    });
  }
});

router.patch(
  '/messages/:id/read',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      if (!validDocumentId(id)) return res.status(400).json({ success: false });

      await markContactMessageRead(id);

      res.json({
        success: true,
        message: 'Mensagem marcada como lida',
      });
    } catch (error) {
      logger.error('Erro ao marcar mensagem como lida:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao marcar mensagem como lida' },
      });
    }
  }
);

export default router;
