"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackMap = void 0;
const feedback_entity_1 = require("../domain/feedback.entity");
class FeedbackMap {
    static toDTO(feedback) {
        return {
            id: feedback.id,
            formularioId: feedback.formularioId,
            perguntaId: feedback.perguntaId,
            tipo: feedback.tipo,
            resposta_texto: feedback.resposta_texto,
            nota: feedback.nota,
            opcaoEscolhida: feedback.opcaoEscolhida,
            data_resposta: feedback.data_resposta,
        };
    }
    // Para reconstruir a entidade só com props (sem carregar objetos complexos)
    static toDomain(dto) {
        return new feedback_entity_1.Feedback({
            id: dto.id,
            formularioId: dto.formularioId,
            perguntaId: dto.perguntaId,
            tipo: dto.tipo,
            resposta_texto: dto.resposta_texto,
            nota: dto.nota,
            opcaoEscolhida: dto.opcaoEscolhida,
            data_resposta: dto.data_resposta,
        });
    }
}
exports.FeedbackMap = FeedbackMap;
//# sourceMappingURL=feedback.map.js.map