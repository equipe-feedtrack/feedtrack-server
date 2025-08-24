import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PerguntaRepositoryPrisma } from '../infra/pergunta/pergunta.repository.prisma';
import { CriarPerguntaUseCase } from '../application/use-cases/pergunta/criarPerguntaUseCase';
import { BuscarPerguntaPorIdUseCase } from '../application/use-cases/pergunta/BuscarPerguntaPorIdUseCase';
import { AtualizarPerguntaUseCase } from '../application/use-cases/pergunta/AtualizarPerguntaUseCase';
import { DeletarPerguntaUseCase } from '../application/use-cases/pergunta/DeletarPerguntaUseCase';
import { PerguntaController } from './controller/pergunta.controller';
import { ListarPerguntasUseCase } from '../application/use-cases/pergunta/listar-perguntas.usecase';
import { authenticateToken } from '@shared/presentation/http/middlewares/validation.middleware';


// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA
// ====================================================================

const prismaClient = new PrismaClient();
const perguntaRepository = new PerguntaRepositoryPrisma(prismaClient);

const criarPerguntaUseCase = new CriarPerguntaUseCase(perguntaRepository);
const buscarPerguntaPorIdUseCase = new BuscarPerguntaPorIdUseCase(perguntaRepository);
const listarPerguntasUseCase = new ListarPerguntasUseCase(perguntaRepository);
const atualizarPerguntaUseCase = new AtualizarPerguntaUseCase(perguntaRepository);
const deletarPerguntaUseCase = new DeletarPerguntaUseCase(perguntaRepository);

const perguntaController = new PerguntaController(
  criarPerguntaUseCase,
  buscarPerguntaPorIdUseCase,
  listarPerguntasUseCase,
  atualizarPerguntaUseCase,
  deletarPerguntaUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const perguntaRouter = Router();

/**
 * @swagger
 * /pergunta:
 *   post:
 *     summary: Cria uma nova pergunta
 *     tags: [Perguntas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - texto
 *               - tipo
 *             properties:
 *               texto:
 *                 type: string
 *                 description: O texto da pergunta.
 *               tipo:
 *                 type: string
 *                 enum: [nota, texto, multipla_escolha]
 *                 description: O tipo da pergunta.
 *               opcoes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Opções para perguntas de múltipla escolha (obrigatório se tipo for 'multipla_escolha').
 *     responses:
 *       201:
 *         description: Pergunta criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 texto:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 opcoes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dataCriacao:
 *                   type: string
 *                   format: date-time
 *                 dataAtualizacao:
 *                   type: string
 *                   format: date-time
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
perguntaRouter.post('/pergunta', authenticateToken, perguntaController.criar);

/**
 * @swagger
 * /perguntas:
 *   get:
 *     summary: Lista todas as perguntas
 *     tags: [Perguntas]
 *     parameters:
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtra perguntas por status ativo (opcional).
 *     responses:
 *       200:
 *         description: Lista de perguntas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   texto:
 *                     type: string
 *                   tipo:
 *                     type: string
 *                   ativo:
 *                     type: boolean
 *                   opcoes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   dataCriacao:
 *                     type: string
 *                     format: date-time
 *                   dataAtualizacao:
 *                     type: string
 *                     format: date-time
 *                   dataExclusao:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *       500:
 *         description: Erro interno do servidor.
 */
perguntaRouter.get('/perguntas', authenticateToken, perguntaController.listar);

/**
 * @swagger
 * /pergunta/{id}:
 *   get:
 *     summary: Busca uma pergunta por ID
 *     tags: [Perguntas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da pergunta.
 *     responses:
 *       200:
 *         description: Detalhes da pergunta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 texto:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 opcoes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dataCriacao:
 *                   type: string
 *                   format: date-time
 *                 dataAtualizacao:
 *                   type: string
 *                   format: date-time
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       404:
 *         description: Pergunta não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
perguntaRouter.get('/pergunta/:id', authenticateToken, perguntaController.buscarPorId);

/**
 * @swagger
 * /atualizar-pergunta/{id}:
 *   put:
 *     summary: Atualiza uma pergunta existente
 *     tags: [Perguntas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da pergunta a ser atualizada.
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID da pergunta a ser atualizada (obrigatório).
 *               texto:
 *                 type: string
 *                 description: Novo texto da pergunta (opcional).
 *     responses:
 *       200:
 *         description: Pergunta atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 texto:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 opcoes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dataCriacao:
 *                   type: string
 *                   format: date-time
 *                 dataAtualizacao:
 *                   type: string
 *                   format: date-time
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Pergunta não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */

perguntaRouter.put('/atualizar-pergunta/:id', authenticateToken, perguntaController.atualizar);

/**
 * @swagger
 * /deletar-pergunta/{id}:
 *   delete:
 *     summary: Deleta uma pergunta (exclusão lógica)
 *     tags: [Perguntas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da pergunta a ser deletada.
 *     responses:
 *       204:
 *         description: Pergunta deletada com sucesso (sem conteúdo).
 *       404:
 *         description: Pergunta não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
perguntaRouter.delete('/deletar-pergunta/:id', authenticateToken, perguntaController.deletar);

export { perguntaRouter };
