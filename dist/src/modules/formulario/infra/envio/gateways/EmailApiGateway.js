"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailGateway = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * @description Implementação de exemplo de um gateway de e-mail.
 * Utiliza Nodemailer para se conectar a um servidor SMTP.
 * As credenciais devem ser gerenciadas em variáveis de ambiente.
 */
class EmailGateway {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true', // Use 'true' ou 'false'
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    /**
     * Envia um e-mail com o formulário anexado.
     * @param destinatario O endereço de e-mail do cliente.
     * @param conteudo O conteúdo da mensagem (ex: template).
     * @param formularioId O ID do formulário a ser anexado ao link.
     * @param link O link base para o formulário.
     */
    async enviar(destinatario, conteudo, formularioId, link) {
        console.log(`[EmailGateway] Preparando para enviar e-mail para: ${destinatario}`);
        try {
            const linkCompleto = `${link}/${formularioId}`;
            const mensagemCompleta = `${conteudo}\n\nResponda aqui: ${linkCompleto}`;
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: destinatario,
                subject: 'Novo Formulário para Você!',
                html: `<p>${mensagemCompleta}</p>`,
            };
            await this.transporter.sendMail(mailOptions);
            console.log(`[EmailGateway] E-mail para ${destinatario} enviado com sucesso.`);
        }
        catch (error) {
            console.error(`[EmailGateway] Erro ao enviar e-mail: ${error.message}`);
            throw new Error(`Falha ao comunicar com o serviço de e-mail.`);
        }
    }
}
exports.EmailGateway = EmailGateway;
//# sourceMappingURL=EmailApiGateway.js.map