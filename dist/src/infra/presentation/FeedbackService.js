"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const crypto_1 = require("crypto");
/**
 * Esta é uma implementação SIMULADA do serviço de Feedback.
 * No futuro, esta classe poderia fazer uma chamada a um outro microsserviço
 * ou interagir com o repositório de Feedback para criar um registro real no banco.
 */
class FeedbackService {
    async iniciarColeta(formularioId, clienteId) {
        console.log(`[FeedbackService] Iniciando coleta para formulário ${formularioId} e cliente ${clienteId}.`);
        // Simula a criação de um registro de feedback no banco de dados.
        const feedbackId = (0, crypto_1.randomUUID)();
        console.log(`[FeedbackService] ID de coleta gerado: ${feedbackId}`);
        // Retorna o ID que será usado para construir o link de envio.
        return feedbackId;
    }
}
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=FeedbackService.js.map