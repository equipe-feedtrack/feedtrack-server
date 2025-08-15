// src/modules/formulario/infra/envio/WhatsAppApiGateway.ts
import { IWhatsAppGateway } from '@modules/formulario/infra/envio/IEnvioRepository';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @description Esta é uma implementação de exemplo de um gateway de WhatsApp.
 * Ele lida com a comunicação real com uma API de terceiros para enviar mensagens.
 * A lógica real dependerá do serviço/API que você escolher (ex: Twilio, Z-API).
 */
export class WhatsAppApiGateway implements IWhatsAppGateway {

  private readonly apiUrl: string;
  private readonly feedbackUrl: string;

  constructor() {
    // As credenciais devem vir de variáveis de ambiente, nunca diretamente no código!
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://waha.feedtrack.site/api/sendText';
    this.feedbackUrl = 'http://localhost:3006/api/v1/resposta-formulario';// VINCULAR O LINK REAL QUE IRÁ GERAR A PÁGINA DE FEEDBACK'

    if (!this.apiUrl || !this.feedbackUrl) {
      throw new Error("As variáveis de ambiente WHATSAPP_API_URL e FEEDBACK_URL devem ser configuradas.");
    }
  }

  /**
   * Envia uma mensagem de WhatsApp para um destinatário.
   * @param destinatario O número de telefone do cliente.
   * @param conteudo O conteúdo da mensagem (ex: template).
   * @param link O link base para o formulário.
   */
  public async enviar(destinatario: string, conteudo: string, vendaId: string, campanhaId: string, empresaId: string): Promise<void> {
    
    console.log(`[WhatsAppApiGateway] Preparando para enviar mensagem para: ${destinatario}`);
    const linkCompleto = `${this.feedbackUrl}/empresa/${empresaId}/campanha/${campanhaId}/venda/${vendaId}`;

    const mensagemCompleta = `${conteudo}\n\nResponda aqui: ${linkCompleto}`;

    try {
      

      // Monta o corpo da requisição conforme a documentação da API que você usar
      const payload = {
        "chatId": `55${destinatario}@c.us`, // Exemplo para o formato de chat ID
        "text": mensagemCompleta,
        "session": "default"
      };

      const headers = {

        'Content-Type': 'application/json',

      };

      // Efetivamente envia a requisição para a API externa
      const response = await axios.post(this.apiUrl, payload, { headers });

      // Verifica se a API retornou sucesso
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`API do WhatsApp retornou status inesperado: ${response.status}`);
      }

      console.log(`[WhatsAppApiGateway] Mensagem para ${destinatario} enviada com sucesso.`);

    } catch (error: any) {
      console.error(`[WhatsAppApiGateway] Erro ao enviar mensagem: ${error.message}`);
      // Lança o erro para que o Caso de Uso possa capturá-lo e tratar
      throw new Error(`Falha ao comunicar com o serviço de WhatsApp.`);
    }
  }
}
