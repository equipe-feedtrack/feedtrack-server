import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UsuarioRepositoryPrisma } from '../infra/usuario/usuario.repository.prisma';
import { CriarUsuarioUseCase } from '../application/use-cases/criarUsuarioUseCase';
import { BuscarUsuarioPorIdUseCase } from '../application/use-cases/buscarUsuarioPorIdUseCase';
import { BuscarUsuarioPorNomeUsuarioUseCase } from '../application/use-cases/buscarUsuarioPorNomeUsuarioUseCase';
import { AtualizarUsuarioUseCase } from '../application/use-cases/atualizarUsuarioUseCase';
import { DeletarUsuarioUseCase } from '../application/use-cases/deletarUsuarioUseCase';
import { UsuarioController } from '../presentation/controller/usuario.controller';
import { authMiddleware, validationMiddleware } from '@shared/presentation/http/middlewares/validation.middleware';
import { CriarUsuarioValidationDTO } from './validation/CriarUsuario.dto';
import { AtualizarUsuarioValidationDTO } from './validation/AtualizarUsuario.dto';
import { BuscarTodosUsuariosUseCase } from '../application/use-cases/buscarTodosUsuariosUseCase';

const prismaClient = new PrismaClient();
const usuarioRepository = new UsuarioRepositoryPrisma(prismaClient);
const criarUsuarioUseCase = new CriarUsuarioUseCase(usuarioRepository);
const buscarUsuarioPorIdUseCase = new BuscarUsuarioPorIdUseCase(usuarioRepository);
const buscarUsuarioPorNomeUsuarioUseCase = new BuscarUsuarioPorNomeUsuarioUseCase(usuarioRepository);
const atualizarUsuarioUseCase = new AtualizarUsuarioUseCase(usuarioRepository);
const deletarUsuarioUseCase = new DeletarUsuarioUseCase(usuarioRepository);
const buscarTodosUsuariosUseCase = new BuscarTodosUsuariosUseCase(usuarioRepository);

const usuarioController = new UsuarioController(
  criarUsuarioUseCase,
  buscarUsuarioPorIdUseCase,
  buscarUsuarioPorNomeUsuarioUseCase,
  atualizarUsuarioUseCase,
  deletarUsuarioUseCase,
  buscarTodosUsuariosUseCase
);

const usuarioRouter = Router();

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarUsuarioValidationDTO'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
usuarioRouter.post('/usuario/:empresaId', authMiddleware, validationMiddleware(CriarUsuarioValidationDTO), async (req, res, next) => {
  console.log("CHEGOU aqui")
  try {
    await usuarioController.criar(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Busca todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *       500:
 *         description: Erro interno do servidor.
 */
usuarioRouter.get('/usuarios/:empresaId', authMiddleware, async (req, res, next) => {
  try {
    await usuarioController.buscarTodos(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Detalhes do usuário.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
usuarioRouter.get('/usuarios/:id', authMiddleware, async (req, res, next) => {
  try {
    await usuarioController.buscarPorId(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /usuarios/nome/{nomeUsuario}:
 *   get:
 *     summary: Busca um usuário por nome de usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: nomeUsuario
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome de usuário.
 *     responses:
 *       200:
 *         description: Detalhes do usuário.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
usuarioRouter.get('/usuarios/nome/:nomeUsuario', authMiddleware, async (req, res, next) => {
  try {
    await usuarioController.buscarPorNomeUsuario(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /atualizar-usuario/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarUsuarioValidationDTO'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
usuarioRouter.put('/atualizar-usuario/:id', authMiddleware, validationMiddleware(AtualizarUsuarioValidationDTO), async (req, res, next) => {
  try {
    await usuarioController.atualizar(req, res);
  } catch (err) {
    next(err);
  }
});


/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser deletado.
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
usuarioRouter.delete('/usuarios/:id', authMiddleware, async (req, res, next) => {
  try {
    await usuarioController.deletar(req, res);
  } catch (error) {
    next(error);
  }
});


export { usuarioRouter };
