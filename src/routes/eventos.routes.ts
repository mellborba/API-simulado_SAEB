import { Router, Request, Response } from 'express';
import prisma from '../prismaClient';

const router = Router();

// GET /eventos -> Listar eventos mostrando as informações principais e os palestrantes
router.get('/', async (_req: Request, res: Response) => {
  const eventos = await prisma.evento.findMany({
    include: { palestrantes: true }
  });
  return res.json(eventos);
});

// POST /eventos -> Cadastrar evento
router.post('/', async (req: Request, res: Response) => {
  const { nomeEvento, descricao, local } = req.body;

  if (!nomeEvento || !descricao || !local) {
    return res.status(400).json({ error: 'Nome do evento, descrição e local são obrigatórios.' });
  }

  try {
    const novoEvento = await prisma.evento.create({
      data: { nomeEvento, descricao, local }
    });
    return res.status(201).json(novoEvento);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar evento.' });
  }
});

// PUT /eventos/:id -> Alterar informações do evento E atualizar o palestrante vinculado
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nomeEvento, descricao, local, palestranteId } = req.body;

  if (!nomeEvento || !descricao || !local) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Monta o objeto de atualização
    const dataToUpdate: any = {
      nomeEvento,
      descricao,
      local
    };

    // Se o palestranteId for enviado, substitui (set) o vínculo antigo pelo novo
    if (palestranteId) {
      dataToUpdate.palestrantes = {
        set: [{ id: Number(palestranteId) }]
      };
    }

    const eventoAtualizado = await prisma.evento.update({
      where: { id: Number(id) },
      data: dataToUpdate,
      include: { palestrantes: true }
    });

    return res.json(eventoAtualizado);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao atualizar evento.' });
  }
});

// POST /eventos/:id/palestrantes -> Adicionar palestrante a um evento
router.post('/:id/palestrantes', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { palestranteId } = req.body;

  if (!palestranteId) {
    return res.status(400).json({ error: 'palestranteId é obrigatório.' });
  }

  try {
    const evento = await prisma.evento.update({
      where: { id: Number(id) },
      data: {
        palestrantes: {
          connect: { id: Number(palestranteId) }
        }
      },
      include: { palestrantes: true }
    });
    return res.json(evento);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao adicionar palestrante ao evento.' });
  }
});

// DELETE /eventos/:id/palestrantes/:palestranteId -> Remover palestrante de um evento
router.delete('/:id/palestrantes/:palestranteId', async (req: Request, res: Response) => {
  const { id, palestranteId } = req.params;

  try {
    const evento = await prisma.evento.update({
      where: { id: Number(id) },
      data: {
        palestrantes: {
          disconnect: { id: Number(palestranteId) }
        }
      },
      include: { palestrantes: true }
    });
    return res.json(evento);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao remover palestrante do evento.' });
  }
});

// DELETE /eventos/:id -> Deletar um evento
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.evento.delete({
      where: { id: Number(id) }
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao remover evento.' });
  }
});

export default router;