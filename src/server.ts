import express from 'express';
import eventosRoutes from './routes/eventos.routes';
import palestrantesRoutes from './routes/palestrantes.routes';

const app = express();

// IMPORTANTE: Esta linha deve vir ANTES do app.use das rotas!
app.use(express.json());

app.use('/eventos', eventosRoutes);
app.use('/palestrantes', palestrantesRoutes);

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});