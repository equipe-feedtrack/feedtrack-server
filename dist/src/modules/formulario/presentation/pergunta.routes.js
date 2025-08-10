"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.perguntaRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const pergunta_repository_prisma_1 = require("../infra/pergunta/pergunta.repository.prisma");
const criarPerguntaUseCase_1 = require("../application/use-cases/pergunta/criarPerguntaUseCase");
const BuscarPerguntaPorIdUseCase_1 = require("../application/use-cases/pergunta/BuscarPerguntaPorIdUseCase");
const AtualizarPerguntaUseCase_1 = require("../application/use-cases/pergunta/AtualizarPerguntaUseCase");
const DeletarPerguntaUseCase_1 = require("../application/use-cases/pergunta/DeletarPerguntaUseCase");
const pergunta_controller_1 = require("./controller/pergunta.controller");
const listar_perguntas_usecase_1 = require("../application/use-cases/pergunta/listar-perguntas.usecase");
// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA
// ====================================================================
const prismaClient = new client_1.PrismaClient();
const perguntaRepository = new pergunta_repository_prisma_1.PerguntaRepositoryPrisma(prismaClient);
const criarPerguntaUseCase = new criarPerguntaUseCase_1.CriarPerguntaUseCase(perguntaRepository);
const buscarPerguntaPorIdUseCase = new BuscarPerguntaPorIdUseCase_1.BuscarPerguntaPorIdUseCase(perguntaRepository);
const listarPerguntasUseCase = new listar_perguntas_usecase_1.ListarPerguntasUseCase(perguntaRepository);
const atualizarPerguntaUseCase = new AtualizarPerguntaUseCase_1.AtualizarPerguntaUseCase(perguntaRepository);
const deletarPerguntaUseCase = new DeletarPerguntaUseCase_1.DeletarPerguntaUseCase(perguntaRepository);
const perguntaController = new pergunta_controller_1.PerguntaController(criarPerguntaUseCase, buscarPerguntaPorIdUseCase, listarPerguntasUseCase, atualizarPerguntaUseCase, deletarPerguntaUseCase);
// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================
const perguntaRouter = (0, express_1.Router)();
exports.perguntaRouter = perguntaRouter;
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
perguntaRouter.post('/pergunta', perguntaController.criar);
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
perguntaRouter.get('/perguntas', perguntaController.listar);
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
perguntaRouter.get('/pergunta/:id', perguntaController.buscarPorId);
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
perguntaRouter.put('/atualizar-pergunta/:id', perguntaController.atualizar);
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
perguntaRouter.delete('/deletar-pergunta/:id', perguntaController.deletar);
//# sourceMappingURL=pergunta.routes.js.map