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
perguntaRouter.post('/pergunta', (req, res) => perguntaController.criar(req, res));

// Rota para buscar uma pergunta por ID
perguntaRouter.get('/pergunta/:id', (req, res) => perguntaController.buscarPorId(req, res));

// Rota para atualizar uma pergunta
perguntaRouter.put('/update-pergunta/:id', (req, res) => perguntaController.atualizar(req, res));

// Rota para deletar uma pergunta
perguntaRouter.delete('/delete-pergunta/:id', (req, res) => perguntaController.deletar(req, res));

export { perguntaRouter };
