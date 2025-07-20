import { IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";

// Esta é uma implementação de EXEMPLO. A lógica real dependerá
// do serviço/API que você escolher (ex: Twilio, Z-API, Meta Official API).
export class WhatsAppApiGateway implements IWhatsAppGateway {
  
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor() {
    // As credenciais devem vir de variáveis de ambiente, nunca diretamente no código!
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.exemplo-whatsapp.com/send';
    this.apiKey = process.env.WHATSAPP_API_KEY || '';

    if (!this.apiKey) {
      console.warn('AVISO: Chave de API do WhatsApp não configurada.');
    }
  }

  async enviar(destinatario: string, conteudo: string): Promise<void> {
    console.log(`[WhatsAppApiGateway] Preparando para enviar mensagem para: ${destinatario}`);

    try {
      // Monta o corpo da requisição conforme a documentação da API que você usar
      const payload = {
        to: destinatario,
        message: conteudo,
      };

      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
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