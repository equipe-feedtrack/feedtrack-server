import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UsuarioRepositoryPrisma } from '../infra/usuario/usuario.repository.prisma';
import { LoginUseCase } from '../application/use-cases/loginUseCase';
import jwt from "jsonwebtoken";

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

    // Verifica usuário no caso de uso
    const usuario = await loginUseCase.execute({ nomeUsuario, senha });

    if (!usuario) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    // Cria o payload que vai dentro do token
    const payload = {
      id: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      tipo: usuario.tipo // se tiver papel/tipo de usuário
    };

    // Gera o token
    const token = jwt.sign(payload, process.env.JWT_SECRET || "seu_segredo_aqui", {
      expiresIn: "1h", // expira em 1 hora (pode mudar)
    });

    // Retorna usuário + token
    res.json({
      message: "Login realizado com sucesso",
      token,
      usuario,
    });
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
