import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UsuarioRepositoryPrisma } from '../infra/usuario/usuario.repository.prisma';
import { LoginUseCase } from '../application/use-cases/loginUseCase';

const prismaClient = new PrismaClient();
const usuarioRepository = new UsuarioRepositoryPrisma(prismaClient);
const loginUseCase = new LoginUseCase(usuarioRepository);

const authRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeUsuario:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro interno do servidor.
 */
authRouter.post('/login', async (req, res, next) => {
  try {
    const { nomeUsuario, senha } = req.body;
    console.log(nomeUsuario, senha)
    const output = await loginUseCase.execute({ nomeUsuario, senha });
    res.json(output);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/cadastro-empresa:
 *   post:
 *     summary: Cadastra uma nova empresa
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeUsuario:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empresa cadastrada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */

export { authRouter };
