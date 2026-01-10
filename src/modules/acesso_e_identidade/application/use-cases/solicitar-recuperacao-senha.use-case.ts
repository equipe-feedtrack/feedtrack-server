import { IUsuarioRepository } from '@modules/acesso_e_identidade/infra/usuario/usuario.repository.interface';
import { SolicitarRecuperacaoSenhaDTO } from '../dto/recuperacao-senha.dto';

export class SolicitarRecuperacaoSenhaUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute({ email }: SolicitarRecuperacaoSenhaDTO): Promise<void> {
    const usuario = await this.usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
      console.log(`Tentativa de recuperação de senha para o e-mail (não encontrado): ${email}`);
      return;
    }

    usuario.gerarTokenRecuperacaoSenha();
    await this.usuarioRepository.alterar(usuario);

    // Cria o conteúdo do e-mail
    const html = `
      <p>Olá, ${usuario.nomeUsuario}!</p>
      <p>Você solicitou a recuperação de senha no FeedTrack.</p>
      <p>Use o código abaixo para redefinir sua senha (válido por 1 hora):</p>
      <h3>${usuario.tokenRecuperacao}</h3>
      <p>Se você não solicitou, ignore este e-mail.</p>
    `;

    // Envia o e-mail usando a API
    await fetch("https://sendemails-lqua.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "📢 FeedTrack - Recuperação de senha",
        html,
      }),
    });

    console.log(`Token de recuperação enviado para ${email}`);
  }
}
