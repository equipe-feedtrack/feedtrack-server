"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const campanha_repository_prisma_1 = require("../infra/campanha/campanha.repository.prisma");
const formulario_repository_prisma_1 = require("@modules/formulario/infra/formulario/formulario.repository.prisma");
const criarCampanhaUseCase_1 = require("../application/use-cases/criarCampanhaUseCase");
const listarCampanhaUseCase_1 = require("../application/use-cases/listarCampanhaUseCase");
const buscarCampanhaUseCase_1 = require("../application/use-cases/buscarCampanhaUseCase");
const atualizarCampanhaUseCase_1 = require("../application/use-cases/atualizarCampanhaUseCase");
const deletarCampanhaUseCase_1 = require("../application/use-cases/deletarCampanhaUseCase");
const campanha_controller_1 = require("./controller/campanha.controller");
// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA (Exemplo de como as peças se conectam)
// ====================================================================
// 1. Instanciar o Prisma Client
const prismaClient = new client_1.PrismaClient();
// 2. Instanciar os Repositórios
const campanhaRepository = new campanha_repository_prisma_1.CampanhaRepositoryPrisma(prismaClient);
const formularioRepository = new formulario_repository_prisma_1.FormularioRepositoryPrisma(prismaClient); // Necessário para o CriarCampanhaUseCase
// 3. Instanciar os Casos de Uso, injetando os repositórios
const criarCampanhaUseCase = new criarCampanhaUseCase_1.CriarCampanhaUseCase(campanhaRepository, formularioRepository);
const listarCampanhasUseCase = new listarCampanhaUseCase_1.ListarCampanhasUseCase(campanhaRepository);
const buscarCampanhaPorIdUseCase = new buscarCampanhaUseCase_1.BuscarCampanhaPorIdUseCase(campanhaRepository);
const atualizarCampanhaUseCase = new atualizarCampanhaUseCase_1.AtualizarCampanhaUseCase(campanhaRepository);
const deletarCampanhaUseCase = new deletarCampanhaUseCase_1.DeletarCampanhaUseCase(campanhaRepository);
// 4. Instanciar o Controller, injetando os casos de uso
const campanhaController = new campanha_controller_1.CampanhaController(criarCampanhaUseCase, listarCampanhasUseCase, buscarCampanhaPorIdUseCase, atualizarCampanhaUseCase, deletarCampanhaUseCase);
// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================
const campanhaRouter = (0, express_1.Router)();
exports.campanhaRouter = campanhaRouter;
/**
 * @swagger
 * /campanha:
 *   post:
 *     summary: Cria uma nova campanha
 *     tags: [Campanhas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - tipoCampanha
 *               - segmentoAlvo
 *               - dataInicio
 *               - templateMensagem
 *               - formularioId
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título da campanha.
 *               descricao:
 *                 type: string
 *                 description: Descrição da campanha (opcional).
 *               tipoCampanha:
 *                 type: string
 *                 enum: [POS_COMPRA, AUTOMATICO, PROMOCIONAL, SATISFACAO]
 *                 description: Tipo da campanha.
 *               segmentoAlvo:
 *                 type: string
 *                 enum: [TODOS_CLIENTES, CLIENTES_REGULARES, NOVOS_CLIENTES, CLIENTES_PREMIUM]
 *                 description: Segmento de clientes alvo.
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Data de início da campanha (ISO 8601).
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Data de fim da campanha (ISO 8601, opcional).
 *               templateMensagem:
 *                 type: string
 *                 description: Template da mensagem da campanha.
 *               formularioId:
 *                 type: string
 *                 description: ID do formulário associado à campanha.
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 tipoCampanha:
 *                   type: string
 *                 segmentoAlvo:
 *                   type: string
 *                 dataInicio:
 *                   type: string
 *                   format: date-time
 *                 dataFim:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 templateMensagem:
 *                   type: string
 *                 formularioId:
 *                   type: string
 *                 ativo:
 *                   type: boolean
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
campanhaRouter.post('/campanha', campanhaController.criar);
/**
 * @swagger
 * /campanhas:
 *   get:
 *     summary: Lista todas as campanhas
 *     tags: [Campanhas]
 *     responses:
 *       200:
 *         description: Lista de campanhas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   tipoCampanha:
 *                     type: string
 *                   segmentoAlvo:
 *                     type: string
 *                   dataInicio:
 *                     type: string
 *                     format: date-time
 *                   dataFim:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   templateMensagem:
 *                     type: string
 *                   formularioId:
 *                     type: string
 *                   ativo:
 *                     type: boolean
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
campanhaRouter.get('/campanhas', campanhaController.listar);
/**
 * @swagger
 * /campanha/{id}:
 *   get:
 *     summary: Busca uma campanha por ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha.
 *     responses:
 *       200:
 *         description: Detalhes da campanha.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 tipoCampanha:
 *                   type: string
 *                 segmentoAlvo:
 *                   type: string
 *                 dataInicio:
 *                   type: string
 *                   format: date-time
 *                 dataFim:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 templateMensagem:
 *                   type: string
 *                 formularioId:
 *                   type: string
 *                 ativo:
 *                   type: boolean
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
 *         description: Campanha não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
campanhaRouter.get('/campanha/:id', campanhaController.buscarPorId);
/**
 * @swagger
 * /atualizar-campanha/{id}:
 *   put:
 *     summary: Atualiza uma campanha existente
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templateMensagem:
 *                 type: string
 *                 description: Novo template da mensagem (opcional).
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data de início (ISO 8601, opcional).
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Nova data de fim (ISO 8601, opcional).
 *               ativo:
 *                 type: boolean
 *                 description: Status de ativação da campanha (true para ativa, false para inativa).
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 tipoCampanha:
 *                   type: string
 *                 segmentoAlvo:
 *                   type: string
 *                 dataInicio:
 *                   type: string
 *                   format: date-time
 *                 dataFim:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 templateMensagem:
 *                   type: string
 *                 formularioId:
 *                   type: string
 *                 ativo:
 *                   type: boolean
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
 *         description: Campanha não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
campanhaRouter.put('/atualizar-campanha/:id', campanhaController.atualizar);
/**
 * @swagger
 * /deletar-campanha/{id}:
 *   delete:
 *     summary: Deleta uma campanha (exclusão lógica)
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha a ser deletada.
 *     responses:
 *       204:
 *         description: Campanha deletada com sucesso (sem conteúdo).
 *       404:
 *         description: Campanha não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
campanhaRouter.delete('/deletar-campanha/:id', campanhaController.deletar);
//# sourceMappingURL=campanha.routes.js.map