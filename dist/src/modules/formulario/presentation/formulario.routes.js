"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formularioRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const formulario_repository_prisma_1 = require("../infra/formulario/formulario.repository.prisma");
const pergunta_repository_prisma_1 = require("../infra/pergunta/pergunta.repository.prisma");
const CriarFormularioUseCase_1 = require("../application/use-cases/formulario/CriarFormularioUseCase");
const listarFormulariosUseCase_1 = require("../application/use-cases/formulario/listarFormulariosUseCase");
const buscarFormularioPorIdUseCase_1 = require("../application/use-cases/formulario/buscarFormularioPorIdUseCase");
const atualizarFormularioUseCase_1 = require("../application/use-cases/formulario/atualizarFormularioUseCase");
const formulario_controller_1 = require("./controller/formulario.controller");
const deletarFormularioUseCase_1 = require("../application/use-cases/formulario/deletarFormularioUseCase");
// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA (Exemplo de como as peças se conectam)
// ====================================================================
// 1. Instanciar o Prisma Client
const prismaClient = new client_1.PrismaClient();
// 2. Instanciar os Repositórios
const formularioRepository = new formulario_repository_prisma_1.FormularioRepositoryPrisma(prismaClient);
const perguntaRepository = new pergunta_repository_prisma_1.PerguntaRepositoryPrisma(prismaClient); // Necessário para os casos de uso de formulário
// 3. Instanciar os Casos de Uso, injetando os repositórios
const criarFormularioUseCase = new CriarFormularioUseCase_1.CriarFormularioUseCase(formularioRepository, perguntaRepository);
const listarFormulariosUseCase = new listarFormulariosUseCase_1.ListarFormulariosUseCase(formularioRepository);
const buscarFormularioPorIdUseCase = new buscarFormularioPorIdUseCase_1.BuscarFormularioPorIdUseCase(formularioRepository);
const atualizarFormularioUseCase = new atualizarFormularioUseCase_1.AtualizarFormularioUseCase(formularioRepository, perguntaRepository);
const deletarFormularioUseCase = new deletarFormularioUseCase_1.DeletarFormularioUseCase(formularioRepository);
// 4. Instanciar o Controller, injetando os casos de uso
const formularioController = new formulario_controller_1.FormularioController(criarFormularioUseCase, listarFormulariosUseCase, buscarFormularioPorIdUseCase, atualizarFormularioUseCase, deletarFormularioUseCase);
// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================
const formularioRouter = (0, express_1.Router)();
exports.formularioRouter = formularioRouter;
/**
 * @swagger
 * /formulario:
 *   post:
 *     summary: Cria um novo formulário
 *     tags: [Formulários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - idsPerguntas
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do formulário.
 *               descricao:
 *                 type: string
 *                 description: Descrição do formulário.
 *               ativo:
 *                 type: boolean
 *                 description: Indica se o formulário está ativo (opcional, padrão true).
 *               idsPerguntas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs das perguntas a serem associadas ao formulário.
 *     responses:
 *       201:
 *         description: Formulário criado com sucesso.
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
 *                 perguntas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       texto:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       opcoes:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
formularioRouter.post('/formulario', formularioController.criar);
/**
 * @swagger
 * /formularios:
 *   get:
 *     summary: Lista todos os formulários
 *     tags: [Formulários]
 *     responses:
 *       200:
 *         description: Lista de formulários.
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
 *                   perguntas:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         texto:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                         opcoes:
 *                           type: array
 *                           items:
 *                             type: string
 *       500:
 *         description: Erro interno do servidor.
 */
formularioRouter.get('/formularios', formularioController.listar);
/**
 * @swagger
 * /formulario/{id}:
 *   get:
 *     summary: Busca um formulário por ID
 *     tags: [Formulários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do formulário.
 *     responses:
 *       200:
 *         description: Detalhes do formulário.
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
 *                 perguntas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       texto:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       opcoes:
 *                         type: array
 *                         items:
 *                           type: string
 *       404:
 *         description: Formulário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
formularioRouter.get('/formulario/:id', formularioController.buscarPorId);
/**
 * @swagger
 * /update-formulario/{id}:
 *   put:
 *     summary: Atualiza um formulário existente
 *     tags: [Formulários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do formulário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Novo título do formulário (opcional).
 *               descricao:
 *                 type: string
 *                 description: Nova descrição do formulário (opcional).
 *               ativo:
 *                 type: boolean
 *                 description: Novo status de ativo do formulário (opcional).
 *               idsPerguntas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Nova lista de IDs de perguntas para o formulário (substitui as existentes).
 *     responses:
 *       200:
 *         description: Formulário atualizado com sucesso.
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
 *                 perguntas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       texto:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       opcoes:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Formulário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
formularioRouter.put('/update-formulario/:id', formularioController.atualizar);
/**
 * @swagger
 * /delete-formulario/{id}:
 *   delete:
 *     summary: Deleta um formulário (exclusão lógica)
 *     tags: [Formulários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do formulário a ser deletado.
 *     responses:
 *       204:
 *         description: Formulário deletado com sucesso (sem conteúdo).
 *       404:
 *         description: Formulário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
formularioRouter.delete('/delete-formulario/:id', formularioController.deletar);
//# sourceMappingURL=formulario.routes.js.map