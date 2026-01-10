import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UsuarioRepositoryPrisma } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.prisma';
import { SolicitarRecuperacaoSenhaUseCase } from '@modules/acesso_e_identidade/application/use-cases/solicitar-recuperacao-senha.use-case';
import { ConfirmarRecuperacaoSenhaUseCase } from '@modules/acesso_e_identidade/application/use-cases/confirmar-recuperacao-senha.use-case';

const prisma = new PrismaClient();
const usuarioRepository = new UsuarioRepositoryPrisma(prisma);

const solicitarRecuperacaoSenhaUseCase = new SolicitarRecuperacaoSenhaUseCase(usuarioRepository);
const confirmarRecuperacaoSenhaUseCase = new ConfirmarRecuperacaoSenhaUseCase(usuarioRepository);

export class RecuperacaoSenhaController {
  async solicitar(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    console.log(`Tentativa de recuperação de senha para o e-mail: ${email}`);

    await solicitarRecuperacaoSenhaUseCase.execute({ email });

    return response.status(204).send();
  }

  async confirmar(request: Request, response: Response): Promise<Response> {
    const { token, novaSenha, confirmacaoNovaSenha } = request.body;

    await confirmarRecuperacaoSenhaUseCase.execute({ token, novaSenha, confirmacaoNovaSenha });

    return response.status(204).send();
  }
}
