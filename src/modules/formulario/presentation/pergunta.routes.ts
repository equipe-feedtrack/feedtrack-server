import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PerguntaRepositoryPrisma } from '../infra/pergunta/pergunta.repository.prisma';
import { CriarPerguntaUseCase } from '../application/use-cases/pergunta/criarPerguntaUseCase';
import { BuscarPerguntaPorIdUseCase } from '../application/use-cases/pergunta/BuscarPerguntaPorIdUseCase';
import { AtualizarPerguntaUseCase } from '../application/use-cases/pergunta/AtualizarPerguntaUseCase';
import { DeletarPerguntaUseCase } from '../application/use-cases/pergunta/DeletarPerguntaUseCase';
import { PerguntaController } from './controller/pergunta.controller';


// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA
// ====================================================================

const prismaClient = new PrismaClient();
const perguntaRepository = new PerguntaRepositoryPrisma(prismaClient);

const criarPerguntaUseCase = new CriarPerguntaUseCase(perguntaRepository);
const buscarPerguntaPorIdUseCase = new BuscarPerguntaPorIdUseCase(perguntaRepository);
const atualizarPerguntaUseCase = new AtualizarPerguntaUseCase(perguntaRepository);
const deletarPerguntaUseCase = new DeletarPerguntaUseCase(perguntaRepository);

const perguntaController = new PerguntaController(
  criarPerguntaUseCase,
  buscarPerguntaPorIdUseCase,
  atualizarPerguntaUseCase,
  deletarPerguntaUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const perguntaRouter = Router();

// Rota para criar uma nova pergunta
perguntaRouter.post('/pergunta', perguntaController.criar);

// Rota para buscar uma pergunta por ID
perguntaRouter.get('/pergunta/:id', perguntaController.buscarPorId);

// Rota para atualizar uma pergunta
perguntaRouter.put('/update-pergunta/:id', perguntaController.atualizar);

// Rota para deletar uma pergunta
perguntaRouter.delete('/delete-pergunta/:id', perguntaController.deletar);

export { perguntaRouter };
