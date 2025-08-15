import { IEmailGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import dotenv from 'dotenv';
dotenv.config();

export class EmailGateway implements IEmailGateway {
  private readonly feedbackUrl: string;

  constructor() {
    this.feedbackUrl = 'http://localhost:3000/api/v1/resposta-formulario'; // URL base do serviço de feedback
  }

  /**
   * Envia um e-mail usando a API externa de envio FeedTrack.
   */
  async enviar(destinatario: string, conteudo: string, vendaId: string, empresaId: string, campanhaId: string): Promise<void> {
    console.log(`[EmailGateway] Preparando para enviar e-mail para: ${destinatario}`);

    try {
      const linkCompleto = `${this.feedbackUrl}/empresa/${empresaId}/campanha/${campanhaId}/venda/${vendaId}`;


      // Corpo HTML mais elaborado e com identidade FeedTrack
      const mensagemCompleta = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #2c3e50;">📢 FeedTrack - Você recebeu um novo formulário!</h2>
          <p>Olá,</p>
          <p>${conteudo}</p>
          <p>
            Para responder, basta clicar no link abaixo:
            <br>
            <a href="${linkCompleto}" style="color: #1abc9c; font-weight: bold;">
              Responder Formulário
            </a>
          </p>
          <hr style="margin-top: 30px;">
          <p style="font-size: 12px; color: #999;">
            Mensagem enviada automaticamente pelo sistema FeedTrack.<br>
            Por favor, não responda diretamente a este e-mail.
          </p>
        </div>
      `;

      const emailResponse = await fetch('https://sendemails-lqua.onrender.com/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: destinatario,
          subject: '📢 FeedTrack - Novo Formulário para Você!',
          html: mensagemCompleta,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(`Falha ao enviar e-mail. Status: ${emailResponse.status}`);
      }

      console.log(`[EmailGateway] E-mail para ${destinatario} enviado com sucesso.`);
    } catch (error: any) {
      console.error(`[EmailGateway] Erro ao enviar e-mail: ${error.message}`);
      throw new Error(`Falha ao comunicar com o serviço de e-mail.`);
    }
  }
}
