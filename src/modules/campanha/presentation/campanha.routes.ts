import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CampanhaRepositoryPrisma } from '../infra/campanha/campanha.repository.prisma';
import { FormularioRepositoryPrisma } from '@modules/formulario/infra/formulario/formulario.repository.prisma';
import { CriarCampanhaUseCase } from '../application/use-cases/criarCampanhaUseCase';
import { ListarCampanhasUseCase } from '../application/use-cases/listarCampanhaUseCase';
import { BuscarCampanhaPorIdUseCase } from '../application/use-cases/buscarCampanhaUseCase';
import { AtualizarCampanhaUseCase } from '../application/use-cases/atualizarCampanhaUseCase';
import { DeletarCampanhaUseCase } from '../application/use-cases/deletarCampanhaUseCase';
import { CampanhaController } from './controller/campanha.controller';
import { validationMiddleware } from '@shared/presentation/http/middlewares/validation.middleware';
import { CriarCampanhaValidationDTO } from './validation/CriarCampanha.dto';
import { AtualizarCampanhaValidationDTO } from './validation/AtualizarCampanha.dto';


// ====================================================================
// INJEÇÃO DE DEPENDÊNCIA (Exemplo de como as peças se conectam)
// ====================================================================

// 1. Instanciar o Prisma Client
const prismaClient = new PrismaClient();

// 2. Instanciar os Repositórios
const campanhaRepository = new CampanhaRepositoryPrisma(prismaClient);
const formularioRepository = new FormularioRepositoryPrisma(prismaClient); // Necessário para o CriarCampanhaUseCase

// 3. Instanciar os Casos de Uso, injetando os repositórios
const criarCampanhaUseCase = new CriarCampanhaUseCase(campanhaRepository, formularioRepository);
const listarCampanhasUseCase = new ListarCampanhasUseCase(campanhaRepository);
const buscarCampanhaPorIdUseCase = new BuscarCampanhaPorIdUseCase(campanhaRepository);
const atualizarCampanhaUseCase = new AtualizarCampanhaUseCase(campanhaRepository);
const deletarCampanhaUseCase = new DeletarCampanhaUseCase(campanhaRepository);

// 4. Instanciar o Controller, injetando os casos de uso
const campanhaController = new CampanhaController(
  criarCampanhaUseCase,
  listarCampanhasUseCase,
  buscarCampanhaPorIdUseCase,
  atualizarCampanhaUseCase,
  deletarCampanhaUseCase
);

// ====================================================================
// DEFINIÇÃO DAS ROTAS
// ====================================================================

const campanhaRouter = Router();

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
 *             $ref: '#/components/schemas/CriarCampanhaValidationDTO'
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampanhaResponseDTO'
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
campanhaRouter.post('/campanha', validationMiddleware(CriarCampanhaValidationDTO), campanhaController.criar);

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
 *                 $ref: '#/components/schemas/CampanhaResponseDTO'
 *       500:
 *         description: Erro interno do servidor.
 */
campanhaRouter.get('/campanhas',  campanhaController.listar);

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
 *               $ref: '#/components/schemas/CampanhaResponseDTO'
 *       404:
 *         description: Campanha não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
campanhaRouter.get('/campanha/:id/empresa/:empresaId', campanhaController.buscarPorId);

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
 *             $ref: '#/components/schemas/AtualizarCampanhaValidationDTO'
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampanhaResponseDTO'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Campanha não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
campanhaRouter.put('/atualizar-campanha/:id', validationMiddleware(AtualizarCampanhaValidationDTO), campanhaController.atualizar);

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

export { campanhaRouter };
