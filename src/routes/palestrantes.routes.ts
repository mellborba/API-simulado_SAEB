import { Router, Request, Response } from 'express';
import prisma from '../prismaClient';

const router = Router();

// GET /palestrantes -> Listar todos com os seus eventos
router.get('/', async (_req: Request, res: Response) => {
  const palestrantes = await prisma.palestrante.findMany({
    include: { eventos: true }
  });
  return res.json(palestrantes);
});

// POST /palestrantes -> Cadastrar palestrante
router.post('/', async (req: Request, res: Response) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são de preenchimento obrigatório.' });
  }

  try {
    const novoPalestrante = await prisma.palestrante.create({
      data: { nome, email }
    });
    return res.status(201).json(novoPalestrante);
  } catch (error) {
    return res.status(400).json({ error: 'E-mail já cadastrado ou erro ao criar.' });
  }
});

// PUT /palestrantes/:id -> Atualizar palestrante
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são de preenchimento obrigatório.' });
  }

  try {
    const atualizado = await prisma.palestrante.update({
      where: { id: Number(id) },
      data: { nome, email }
    });
    return res.json(atualizado);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar palestrante.' });
  }
});

// DELETE /palestrantes/:id -> Remover palestrante
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.palestrante.delete({
      where: { id: Number(id) }
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao remover palestrante.' });
  }
});

export default router;