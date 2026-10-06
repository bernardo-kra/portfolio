import { requireAdmin } from '../middleware/adminAuth.js';
import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { projectInput, validDocumentId } from '../services/inputValidation.js';

const router = Router();

router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projectsSnapshot = await db.collection('projects').get();
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar projetos' },
    });
  }
});

router.post('/projects', requireAdmin, async (req: Request, res: Response) => {
  try {
    const input = projectInput(req.body);
    if (!input) {
      return res.status(400).json({
        success: false,
        error: { message: 'Título e descrição são obrigatórios' },
      });
    }

    const projectData = {
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      imageUrl: '',
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('projects').add(projectData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...projectData },
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao criar projeto' },
    });
  }
});

router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!validDocumentId(id)) return res.status(400).json({ success: false });
    const doc = await db.collection('projects').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: { message: 'Projeto não encontrado' },
      });
    }

    res.json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar projeto' },
    });
  }
});

router.put('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const input = projectInput(req.body, true);
    if (!validDocumentId(id) || !input) return res.status(400).json({ success: false });
    const updateData = {
      ...input,
      updatedAt: new Date(),
    };

    await db.collection('projects').doc(id).update(updateData);

    const updatedDoc = await db.collection('projects').doc(id).get();

    res.json({
      success: true,
      data: { id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao atualizar projeto' },
    });
  }
});

router.delete('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!validDocumentId(id)) return res.status(400).json({ success: false });
    await db.collection('projects').doc(id).delete();

    res.json({
      success: true,
      message: 'Projeto deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao deletar projeto' },
    });
  }
});

export default router;





