import { IUsuarioRepository } from "@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface";
import { ConfirmarRecuperacaoSenhaDTO } from "../dto/recuperacao-senha.dto";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class ConfirmarRecuperacaoSenhaUseCase {
  constructor(
    @inject("UsuarioRepository")
    private usuarioRepository: IUsuarioRepository
  ) {}

  async execute({
    token,
    novaSenha,
    confirmacaoNovaSenha,
  }: ConfirmarRecuperacaoSenhaDTO): Promise<void> {
    if (novaSenha !== confirmacaoNovaSenha) {
      throw new AppError("As senhas não conferem.");
    }

    const usuario = await this.usuarioRepository.buscarPorTokenRecuperacao(token);

    if (!usuario) {
      throw new AppError("Token de recuperação inválido.");
    }

    const agora = new Date();

    if (!usuario.tokenRecuperacaoExpiracao) {
      throw new AppError("Token de recuperação inválido ou não definido.");
    }

    if (usuario.tokenRecuperacaoExpiracao < agora) {
      throw new AppError("Token de recuperação expirado.");
    }

    // Alteração da senha e limpeza do token
    await usuario.alterarSenha(novaSenha);
    usuario.limparTokenRecuperacaoSenha();
    await this.usuarioRepository.alterar(usuario);

    // Envio do e-mail somente após sucesso
    if (usuario.email) {
      const html = `
        <p>Olá, ${usuario.nomeUsuario}!</p>
        <p>Sua senha no FeedTrack foi alterada com sucesso.</p>
        <p>Se você não realizou essa alteração, entre em contato imediatamente.</p>
      `;

      try {
        await fetch("https://sendemails-lqua.onrender.com/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: usuario.email,
            subject: "📢 FeedTrack - Senha alterada com sucesso",
            html,
          }),
        });
      } catch (err) {
        console.error("Erro ao enviar e-mail de confirmação de senha:", err);
      }
    }
  }
}
