"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppApiGateway = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * @description Esta é uma implementação de exemplo de um gateway de WhatsApp.
 * Ele lida com a comunicação real com uma API de terceiros para enviar mensagens.
 * A lógica real dependerá do serviço/API que você escolher (ex: Twilio, Z-API).
 */
class WhatsAppApiGateway {
    constructor() {
        // As credenciais devem vir de variáveis de ambiente, nunca diretamente no código!
        this.apiUrl = process.env.WHATSAPP_API_URL || 'http://localhost:3000/api/sendText';
        this.feedbackUrl = process.env.FEEDBACK_URL || 'http://localhost:3000/feedback';
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
    async enviar(destinatario, conteudo) {
        console.log(`[WhatsAppApiGateway] Preparando para enviar mensagem para: ${destinatario}`);
        const link = `${this.feedbackUrl}`;
        const linkCompleto = `${link}`;
        const mensagemCompleta = `${conteudo}\n\nResponda aqui: ${linkCompleto}`;
        try {
            // Monta o corpo da requisição conforme a documentação da API que você usar
            const payload = {
                "chatId": `${destinatario}@c.us`, // Exemplo para o formato de chat ID
                "message": mensagemCompleta,
                "session": "default"
            };
            const headers = {
                'Content-Type': 'application/json',
            };
            // Efetivamente envia a requisição para a API externa
            const response = await axios_1.default.post(this.apiUrl, payload, { headers });
            // Verifica se a API retornou sucesso
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`API do WhatsApp retornou status inesperado: ${response.status}`);
            }
            console.log(`[WhatsAppApiGateway] Mensagem para ${destinatario} enviada com sucesso.`);
        }
        catch (error) {
            console.error(`[WhatsAppApiGateway] Erro ao enviar mensagem: ${error.message}`);
            // Lança o erro para que o Caso de Uso possa capturá-lo e tratar
            throw new Error(`Falha ao comunicar com o serviço de WhatsApp.`);
        }
    }
}
exports.WhatsAppApiGateway = WhatsAppApiGateway;
//# sourceMappingURL=WhatsAppApiGateway.js.map