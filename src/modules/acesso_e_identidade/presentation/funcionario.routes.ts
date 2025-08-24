import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FuncionarioRepositoryPrisma } from '../infra/funcionario/funcionario.repository.prisma';
import { CriarFuncionarioUseCase } from '../application/use-cases/criarFuncionarioUseCase';
import { BuscarFuncionarioPorIdUseCase } from '../application/use-cases/buscarFuncionarioPorIdUseCase';
import { BuscarFuncionarioPorUsuarioIdUseCase } from '../application/use-cases/buscarFuncionarioPorUsuarioIdUseCase';
import { AtualizarFuncionarioUseCase } from '../application/use-cases/atualizarFuncionarioUseCase';
import { DeletarFuncionarioUseCase } from '../application/use-cases/deletarFuncionarioUseCase';
import { FuncionarioController } from '../presentation/controller/funcionario.controller';
import { authenticateToken, validationMiddleware } from '@shared/presentation/http/middlewares/validation.middleware';
import { CriarFuncionarioValidationDTO } from './validation/CriarFuncionario.dto';
import { AtualizarFuncionarioValidationDTO } from './validation/AtualizarFuncionario.dto';
import { BuscarTodosFuncionariosUseCase } from '../application/use-cases/buscarTodosFuncionariosUseCase';

const prismaClient = new PrismaClient();
const funcionarioRepository = new FuncionarioRepositoryPrisma(prismaClient);
const criarFuncionarioUseCase = new CriarFuncionarioUseCase(funcionarioRepository);
const buscarFuncionarioPorIdUseCase = new BuscarFuncionarioPorIdUseCase(funcionarioRepository);
const buscarFuncionarioPorUsuarioIdUseCase = new BuscarFuncionarioPorUsuarioIdUseCase(funcionarioRepository);
const atualizarFuncionarioUseCase = new AtualizarFuncionarioUseCase(funcionarioRepository);
const deletarFuncionarioUseCase = new DeletarFuncionarioUseCase(funcionarioRepository);
const buscarTodosFuncionariosUseCase = new BuscarTodosFuncionariosUseCase(funcionarioRepository);


const funcionarioController = new FuncionarioController(
  criarFuncionarioUseCase,
  buscarFuncionarioPorIdUseCase,
  buscarFuncionarioPorUsuarioIdUseCase,
  atualizarFuncionarioUseCase,
  deletarFuncionarioUseCase,
  buscarTodosFuncionariosUseCase
);

const funcionarioRouter = Router();

/**
 * @swagger
 * /funcionario:
 *   post:
 *     summary: Cria um novo funcionário
 *     tags: [Funcionários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarFuncionarioValidationDTO'
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
funcionarioRouter.post(
  '/funcionario', 
  validationMiddleware(CriarFuncionarioValidationDTO),
  authenticateToken, 
  async (req, res, next) => {
    try {
      await funcionarioController.criar(req, res);
      // NÃO precisa retornar nada
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     summary: Busca todos os funcionários
 *     tags: [Funcionários]
 *     responses:
 *       200:
 *         description: Lista de funcionários.
 *       500:
 *         description: Erro interno do servidor.
 */
funcionarioRouter.get('/funcionarios', authenticateToken, async (req, res, next) => {
  try {
    await funcionarioController.buscarTodos(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     summary: Busca um funcionário por ID
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do funcionário.
 *     responses:
 *       200:
 *         description: Detalhes do funcionário.
 *       404:
 *         description: Funcionário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
funcionarioRouter.get('/funcionarios/:id', authenticateToken, async (req, res, next) => {
  try {
    await funcionarioController.buscarPorId(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /funcionarios/usuario/{usuarioId}:
 *   get:
 *     summary: Busca um funcionário por ID de usuário
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário associado ao funcionário.
 *     responses:
 *       200:
 *         description: Detalhes do funcionário.
 *       404:
 *         description: Funcionário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
funcionarioRouter.get('/funcionarios/usuario/:usuarioId',authenticateToken, async (req, res, next) => {
  try {
    await funcionarioController.buscarPorUsuarioId(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /funcionarios/{id}:
 *   put:
 *     summary: Atualiza um funcionário existente
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do funcionário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarFuncionarioValidationDTO'
 *     responses:
 *       200:
 *         description: Funcionário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Funcionário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
funcionarioRouter.put('/funcionarios/:id', validationMiddleware(AtualizarFuncionarioValidationDTO), authenticateToken, async (req, res, next) => {
  try {
    await funcionarioController.atualizar(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /funcionarios/{id}:
 *   delete:
 *     summary: Deleta um funcionário
 *     tags: [Funcionários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do funcionário a ser deletado.
 *     responses:
 *       204:
 *         description: Funcionário deletado com sucesso.
 *       404:
 *         description: Funcionário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
funcionarioRouter.delete('/funcionarios/:id', authenticateToken, async (req, res, next) => {
  try {
    await funcionarioController.deletar(req, res);
  } catch (error) {
    next(error);
  }
});


export { funcionarioRouter };
