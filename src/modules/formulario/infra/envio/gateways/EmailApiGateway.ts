import nodemailer from 'nodemailer';
import { IEmailGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import dotenv from 'dotenv';
dotenv.config();

/**
 * @description Implementação de exemplo de um gateway de e-mail.
 * Utiliza Nodemailer para se conectar a um servidor SMTP.
 * As credenciais devem ser gerenciadas em variáveis de ambiente.
 */
export class EmailGateway implements IEmailGateway {
  private transporter;
  private readonly feedbackUrl: string;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true', // Use 'true' ou 'false'
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    this.feedbackUrl = process.env.FEEDBACK_URL || 'http://localhost:3000/feedback'; // VINCULAR O LINK REAL QUE IRÁ GERAR A PÁGINA DE FEEDBACK'
  }

  /**
   * Envia um e-mail com o formulário anexado.
   * @param destinatario O endereço de e-mail do cliente.
   * @param conteudo O conteúdo da mensagem (ex: template).
   * @param formularioId O ID do formulário a ser anexado ao link.
   * @param link O link base para o formulário.
   */
  async enviar(destinatario: string, conteudo: string, campanhaId: string ): Promise<void> {
    console.log(`[EmailGateway] Preparando para enviar e-mail para: ${destinatario}`);

    try {
      const linkCompleto = `${this.feedbackUrl}/${campanhaId}`;
      const mensagemCompleta = `${conteudo}\n\nResponda aqui: ${linkCompleto}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: destinatario,
        subject: 'Novo Formulário para Você!',
        html: `<p>${mensagemCompleta}</p>`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`[EmailGateway] E-mail para ${destinatario} enviado com sucesso.`);

    } catch (error: any) {
      console.error(`[EmailGateway] Erro ao enviar e-mail: ${error.message}`);
      throw new Error(`Falha ao comunicar com o serviço de e-mail.`);
    }
  }
}