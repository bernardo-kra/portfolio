import { logger } from '../services/logger.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { Router, Request, Response } from 'express';
import {
  listProjects,
  createProject,
  findProject,
  updateProject,
  deleteProject,
} from '../repositories/projectRepository.js';
import { projectInput, validDocumentId } from '../services/inputValidation.js';

const router = Router();

router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await listProjects();

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    logger.error('Erro ao buscar projetos:', error);
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

    const docRef = await createProject(projectData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...projectData },
    });
  } catch (error) {
    logger.error('Erro ao criar projeto:', error);
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
    const doc = await findProject(id);

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
    logger.error('Erro ao buscar projeto:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar projeto' },
    });
  }
});

router.put(
  '/projects/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const input = projectInput(req.body, true);
      if (!validDocumentId(id) || !input)
        return res.status(400).json({ success: false });
      const updateData = {
        ...input,
        updatedAt: new Date(),
      };

      const updatedDoc = await updateProject(id, updateData);

      res.json({
        success: true,
        data: { id: updatedDoc.id, ...updatedDoc.data() },
      });
    } catch (error) {
      logger.error('Erro ao atualizar projeto:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao atualizar projeto' },
      });
    }
  }
);

router.delete(
  '/projects/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      if (!validDocumentId(id)) return res.status(400).json({ success: false });
      await deleteProject(id);

      res.json({
        success: true,
        message: 'Projeto deletado com sucesso',
      });
    } catch (error) {
      logger.error('Erro ao deletar projeto:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Erro ao deletar projeto' },
      });
    }
  }
);

export default router;
