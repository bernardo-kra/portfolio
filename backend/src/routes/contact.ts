import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.post('/messages', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
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

    const docRef = await db.collection('messages').add(messageData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...messageData },
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

router.get('/messages', async (req: Request, res: Response) => {
  try {
    const messagesSnapshot = await db.collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar mensagens' },
    });
  }
});

router.patch('/messages/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await db.collection('messages').doc(id).update({
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

export default router;





