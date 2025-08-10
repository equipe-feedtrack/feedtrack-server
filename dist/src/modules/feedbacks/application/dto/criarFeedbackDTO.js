"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarFeedbackDTO = exports.RespostaDTO = void 0;
const feedback_exceptions_1 = require("@modules/feedbacks/domain/feedback.exceptions");
const IsUUID_1 = require("class-validator/types/decorator/string/IsUUID");
// Validação manual para a resposta de uma única pergunta
class RespostaDTO {
    constructor(data) {
        this.perguntaId = data.perguntaId;
        this.tipo = data.tipo;
        this.resposta_texto = data.resposta_texto;
        this.nota = data.nota;
        this.opcaoEscolhida = data.opcaoEscolhida;
    }
}
exports.RespostaDTO = RespostaDTO;
/**
 * @description DTO para criar um novo Feedback.
 * Representa o corpo da requisição HTTP e valida os dados de forma manual.
 */
class CriarFeedbackDTO {
    constructor(data) {
        // Validação de campos principais
        if (!data.formularioId || !(0, IsUUID_1.isUUID)(data.formularioId)) {
            throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida('ID do formulário deve ser um UUID válido.');
        }
        if (!data.envioId || !(0, IsUUID_1.isUUID)(data.envioId)) {
            throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida('ID do envio deve ser um UUID válido.');
        }
        if (!Array.isArray(data.respostas) || data.respostas.length === 0) {
            throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida('As respostas devem ser um array não vazio.');
        }
        this.formularioId = data.formularioId;
        this.envioId = data.envioId;
        this.respostas = data.respostas.map((r) => new RespostaDTO(r));
    }
}
exports.CriarFeedbackDTO = CriarFeedbackDTO;
//# sourceMappingURL=criarFeedbackDTO.js.map