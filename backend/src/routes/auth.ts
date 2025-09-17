import { Router, Request, Response } from 'express';
import { db, auth } from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import { authRateLimit } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimit, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nome, sobrenome, email, senha e confirmação são obrigatórios' },
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Senhas não coincidem' },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Senha deve ter pelo menos 6 caracteres' },
      });
    }

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({
        success: false,
        error: { message: 'Usuário já existe com este email' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin = email === 'bernardo@kraczkowski.com' || email === 'admin@portfolio.com';
    
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userRef.set(userData);

    const user = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    res.status(201).json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      message: 'Usuário criado com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao registrar usuário' },
    });
  }
});

router.post('/login', authRateLimit, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email e senha são obrigatórios' },
      });
    }

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciais inválidas' },
      });
    }

    const userData = userDoc.data();
    if (!userData) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciais inválidas' },
      });
    }

    const isValidPassword = await bcrypt.compare(password, userData.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciais inválidas' },
      });
    }

    const customToken = await auth.createCustomToken(userData.email);

    res.json({
      success: true,
      data: {
        customToken,
        user: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: userData.role,
        },
      },
      message: 'Login realizado com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao fazer login' },
    });
  }
});

router.get('/profile/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuário não encontrado' },
      });
    }

    const userData = userDoc.data();
    if (!userData) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuário não encontrado' },
      });
    }

    delete userData.password;

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar perfil' },
    });
  }
});

export default router;
