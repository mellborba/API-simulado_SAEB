import { Router, Request, Response } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Função auxiliar simples para validar e-mail no backend
const isEmailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// GET /palestrantes -> Listar todos com os seus eventos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const palestrantes = await prisma.palestrante.findMany({
      include: { eventos: true }
    });
    return res.json(palestrantes);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar palestrantes.' });
  }
});

// POST /palestrantes -> Cadastrar palestrante
router.post('/', async (req: Request, res: Response) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são de preenchimento obrigatório.' });
  }

  if (!isEmailValido(email)) {
    return res.status(400).json({ error: 'Formato de e-mail inválido.' });
  }

  try {
    const novoPalestrante = await prisma.palestrante.create({
      data: { 
        nome: nome.trim(), 
        email: email.trim().toLowerCase() 
      }
    });
    return res.status(201).json(novoPalestrante);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }
    return res.status(400).json({ error: 'Erro ao criar palestrante.' });
  }
});

// PUT /palestrantes/:id -> Atualizar palestrante
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são de preenchimento obrigatório.' });
  }

  if (!isEmailValido(email)) {
    return res.status(400).json({ error: 'Formato de e-mail inválido.' });
  }

  try {
    const atualizado = await prisma.palestrante.update({
      where: { id: Number(id) },
      data: { 
        nome: nome.trim(), 
        email: email.trim().toLowerCase() 
      }
    });
    return res.json(atualizado);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Este e-mail já pertence a outro palestrante.' });
    }
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