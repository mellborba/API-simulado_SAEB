import express from 'express';
import cors from 'cors';
import eventosRoutes from './routes/eventos.routes';
import palestrantesRoutes from './routes/palestrantes.routes';

const app = express();

app.use(cors());
app.use(express.json()); // Adiciona o middleware para parsear JSON

// IMPORTANTE: Esta linha deve vir ANTES do app.use das rotas!
app.use(express.json());

app.use('/eventos', eventosRoutes);
app.use('/palestrantes', palestrantesRoutes);

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});