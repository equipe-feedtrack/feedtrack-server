"use strict";
// src/modules/formulario/infra/http/routes/feedback.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const feedback_repository_prisma_1 = require("../infra/feedback.repository.prisma");
const criarFeedbackUseCase_1 = require("../application/use-cases/criarFeedbackUseCase");
const buscarFeedbackUseCase_1 = require("../application/use-cases/buscarFeedbackUseCase");
const excluirFeedbackUseCase_1 = require("../application/use-cases/excluirFeedbackUseCase");
const feedback_controller_1 = require("./controller/feedback.controller");
const buscarTodosFeedbacksUseCase_1 = require("../application/use-cases/buscarTodosFeedbacksUseCase");
const router = (0, express_1.Router)();
exports.feedbackRoutes = router;
const prisma = new client_1.PrismaClient();
// Injeção de dependências:
// A camada de infraestrutura (repositório) é instanciada primeiro.
const feedbackRepository = new feedback_repository_prisma_1.FeedbackRepositoryPrisma(prisma);
// Em seguida, os casos de uso são criados, recebendo o repositório como dependência.
const criarFeedbackUseCase = new criarFeedbackUseCase_1.CriarFeedbackUseCase(feedbackRepository);
const buscarFeedbackPorEnvioUseCase = new buscarFeedbackUseCase_1.BuscarFeedbackPorEnvioUseCase(feedbackRepository);
const excluirLogicamenteFeedbackUseCase = new excluirFeedbackUseCase_1.ExcluirLogicamenteFeedbackUseCase(feedbackRepository);
const buscarTodosFeedbacksUseCase = new buscarTodosFeedbacksUseCase_1.BuscarTodosFeedbacksUseCase(feedbackRepository);
// O controlador é criado, recebendo os casos de uso como dependências.
const feedbackController = new feedback_controller_1.FeedbackController(criarFeedbackUseCase, buscarFeedbackPorEnvioUseCase, excluirLogicamenteFeedbackUseCase, buscarTodosFeedbacksUseCase);
// Definição das rotas e seus respectivos manipuladores
/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Cria um novo feedback
 *     tags: [Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formularioId
 *               - envioId
 *               - respostas
 *             properties:
 *               formularioId:
 *                 type: string
 *                 description: ID do formulário ao qual o feedback está associado.
 *               envioId:
 *                 type: string
 *                 description: ID do envio do formulário.
 *               respostas:
 *                 type: array
 *                 description: Array de respostas do feedback.
 *                 items:
 *                   type: object
 *                   properties:
 *                     perguntaId:
 *                       type: string
 *                       description: ID da pergunta.
 *                     resposta:
 *                       type: object
 *                       description: Conteúdo da resposta (pode ser string, number, boolean, etc.).
 *     responses:
 *       201:
 *         description: Feedback criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/feedback', feedbackController.criar);
/**
 * @swagger
 * /feedback/{envioId}:
 *   get:
 *     summary: Busca feedback por ID de envio
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: envioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do envio para buscar o feedback.
 *     responses:
 *       200:
 *         description: Feedback encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 formularioId:
 *                   type: string
 *                 envioId:
 *                   type: string
 *                 respostas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       perguntaId:
 *                         type: string
 *                       resposta:
 *                         type: object
 *                 dataCriacao:
 *                   type: string
 *                   format: date-time
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       404:
 *         description: Feedback não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/feedback/:envioId', feedbackController.buscarPorEnvioId);
/**
 * @swagger
 * /feedbacks:
 *   get:
 *     summary: Lista todos os feedbacks
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: Lista de feedbacks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   formularioId:
 *                     type: string
 *                   envioId:
 *                     type: string
 *                   respostas:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         perguntaId:
 *                           type: string
 *                         resposta:
 *                           type: object
 *                   dataCriacao:
 *                     type: string
 *                     format: date-time
 *                   dataExclusao:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/feedbacks', feedbackController.buscarTodos);
/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Exclui logicamente um feedback
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do feedback a ser excluído.
 *     responses:
 *       204:
 *         description: Feedback excluído com sucesso (sem conteúdo).
 *       404:
 *         description: Feedback não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/feedback/:id', feedbackController.excluirLogicamente);
//# sourceMappingURL=feedback.routes.js.map