import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FormularioRepositoryPrisma } from '../infra/formulario/formulario.repository.prisma';
import { PerguntaRepositoryPrisma } from '../infra/pergunta/pergunta.repository.prisma';
import { CriarFormularioUseCase } from '../application/use-cases/formulario/CriarFormularioUseCase';
import { ListarFormulariosUseCase } from '../application/use-cases/formulario/listarFormulariosUseCase';
import { BuscarFormularioPorIdUseCase } from '../application/use-cases/formulario/buscarFormularioPorIdUseCase';
import { AtualizarFormularioUseCase } from '../application/use-cases/formulario/atualizarFormularioUseCase';
import { FormularioController } from './controller/formulario.controller';
import { DeletarFormularioUseCase } from '../application/use-cases/formulario/deletarFormularioUseCase';
import { authMiddleware } from '@shared/presentation/http/middlewares/validation.middleware';

// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA (Exemplo de como as peças se conectam)
// ====================================================================

// 1. Instanciar o Prisma Client
const prismaClient = new PrismaClient();

// 2. Instanciar os Repositórios
const formularioRepository = new FormularioRepositoryPrisma(prismaClient);
const perguntaRepository = new PerguntaRepositoryPrisma(prismaClient); // Necessário para os casos de uso de formulário

// 3. Instanciar os Casos de Uso, injetando os repositórios
const criarFormularioUseCase = new CriarFormularioUseCase(formularioRepository, perguntaRepository);
const listarFormulariosUseCase = new ListarFormulariosUseCase(formularioRepository);
const buscarFormularioPorIdUseCase = new BuscarFormularioPorIdUseCase(formularioRepository);
const atualizarFormularioUseCase = new AtualizarFormularioUseCase(formularioRepository, perguntaRepository);
const deletarFormularioUseCase = new DeletarFormularioUseCase(formularioRepository);

// 4. Instanciar o Controller, injetando os casos de uso
const formularioController = new FormularioController(
  criarFormularioUseCase,
  listarFormulariosUseCase,
  buscarFormularioPorIdUseCase,
  atualizarFormularioUseCase,
  deletarFormularioUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const formularioRouter = Router();

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
formularioRouter.post('/formulario',authMiddleware, formularioController.criar);

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
formularioRouter.get('/formularios', authMiddleware,  formularioController.listar);

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
formularioRouter.get('/formulario/:id', authMiddleware,  formularioController.buscarPorId);

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
formularioRouter.put('/update-formulario/:id', authMiddleware, formularioController.atualizar);

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
formularioRouter.delete('/delete-formulario/:id', authMiddleware, formularioController.deletar);

export { formularioRouter };
