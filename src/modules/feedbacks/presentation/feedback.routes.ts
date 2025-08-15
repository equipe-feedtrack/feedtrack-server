// src/modules/formulario/infra/http/routes/feedback.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FeedbackRepositoryPrisma } from '../infra/feedback.repository.prisma';
import { CriarFeedbackUseCase } from '../application/use-cases/criarFeedbackUseCase';
import { BuscarFeedbackPorEnvioUseCase } from '../application/use-cases/buscarFeedbackUseCase';
import { ExcluirLogicamenteFeedbackUseCase } from '../application/use-cases/excluirFeedbackUseCase';
import { FeedbackController } from './controller/feedback.controller';
import { BuscarTodosFeedbacksUseCase } from '../application/use-cases/buscarTodosFeedbacksUseCase';
import path from 'path';
import { CriarFeedbackManualUseCase } from '../application/use-cases/criarFeedbackManualUseCase';

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
const criarFeedbackManualUseCase = new CriarFeedbackManualUseCase(feedbackRepository);

// O controlador é criado, recebendo os casos de uso como dependências.
const feedbackController = new FeedbackController(
  criarFeedbackUseCase,
  buscarFeedbackPorEnvioUseCase,
  excluirLogicamenteFeedbackUseCase,
  buscarTodosFeedbacksUseCase,
  criarFeedbackManualUseCase
);


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
 * /feedback/manual:
 *   post:
 *     summary: Cria um novo feedback manual
 *     tags: [Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteNome
 *               - produtoNome
 *               - respostas
 *             properties:
 *               clienteNome:
 *                 type: string
 *                 description: Nome do cliente.
 *               produtoNome:
 *                 type: string
 *                 description: Nome do produto.
 *               funcionarioNome:
 *                 type: string
 *                 description: Nome do funcionário que atendeu (opcional).
 *               respostas:
 *                 type: array
 *                 description: Array de respostas do feedback.
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Feedback criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/feedback/manual', feedbackController.criarManual);

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

router.get('/resposta-formulario/empresa/:empresaId/campanha/:campanhaId/venda/:vendaId', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});



router.get('/resposta-formulario-get/empresa/:empresaId/campanha/:campanhaId/vendas/:vendaId', async (req, res): Promise<any> => {
  const { empresaId, vendaId, campanhaId } = req.params;

  console.log(empresaId, vendaId, campanhaId)

  try {
    const envio = await prisma.envioFormulario.findFirst({
      where: {
        empresaId: empresaId,
        campanhaId: campanhaId,
        vendaId: vendaId,
      }
      
    });

    if (!envio) {
      return res.status(404).json({ message: 'Envio não encontrado para esse formulário e cliente' });
    }

    res.json(envio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});


export { router as feedbackRoutes };
