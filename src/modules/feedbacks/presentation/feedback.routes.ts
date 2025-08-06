// src/modules/formulario/infra/http/routes/feedback.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FeedbackRepositoryPrisma } from '../infra/feedback.repository.prisma';
import { CriarFeedbackUseCase } from '../application/use-cases/criarFeedbackUseCase';
import { BuscarFeedbackPorEnvioUseCase } from '../application/use-cases/buscarFeedbackUseCase';
import { ExcluirLogicamenteFeedbackUseCase } from '../application/use-cases/excluirFeedbackUseCase';
import { FeedbackController } from './controller/feedback.controller';
import { BuscarTodosFeedbacksUseCase } from '../application/use-cases/buscarTodosFeedbacksUseCase';

const router = Router();
const prisma = new PrismaClient();

// Injeção de dependências:
// A camada de infraestrutura (repositório) é instanciada primeiro.
const feedbackRepository = new FeedbackRepositoryPrisma(prisma);

// Em seguida, os casos de uso são criados, recebendo o repositório como dependência.
const criarFeedbackUseCase = new CriarFeedbackUseCase(feedbackRepository);
const buscarFeedbackPorEnvioUseCase = new BuscarFeedbackPorEnvioUseCase(feedbackRepository);
const excluirLogicamenteFeedbackUseCase = new ExcluirLogicamenteFeedbackUseCase(feedbackRepository);
const buscarTodosFeedbacksUseCase = new BuscarTodosFeedbacksUseCase(feedbackRepository);

// O controlador é criado, recebendo os casos de uso como dependências.
const feedbackController = new FeedbackController(
  criarFeedbackUseCase,
  buscarFeedbackPorEnvioUseCase,
  excluirLogicamenteFeedbackUseCase,
  buscarTodosFeedbacksUseCase,
);


// Definição das rotas e seus respectivos manipuladores
router.post('/feedback', feedbackController.criar);
router.get('/feedback/:envioId', feedbackController.buscarPorEnvioId);
router.get('/feedbacks', feedbackController.buscarTodos);
router.delete('/feedback/:id', feedbackController.excluirLogicamente);

export { router as feedbackRoutes };
