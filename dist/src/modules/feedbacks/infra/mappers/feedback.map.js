"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackMap = void 0;
const feedback_entity_1 = require("@modules/feedbacks/domain/feedback.entity");
class FeedbackMap {
    /**
     * Converte um objeto do Prisma para a Entidade de Domínio Feedback.
     * Ele lida com a tradução dos campos do banco (snake_case) para o domínio (camelCase).
     */
    static toDomain(raw) {
        // Prisma já retorna o campo JSON como um objeto, então não precisamos de JSON.parse.
        const props = {
            id: raw.id,
            formularioId: raw.formularioId,
            envioId: raw.envioId, // Adicionado para consistência
            respostas: raw.resposta,
            dataCriacao: raw.dataCriacao,
            dataExclusao: raw.dataExclusao ?? null,
        };
        return feedback_entity_1.Feedback.recuperar(props);
    }
    /**
     * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
     * Ele lida com a tradução dos campos do domínio (camelCase) para o banco (snake_case).
     */
    static toPersistence(feedback) {
        return {
            id: feedback.id,
            formularioId: feedback.formularioId,
            envioId: feedback.envioId, // Adicionado para consistência
            resposta: feedback.respostas,
            dataCriacao: feedback.dataCriacao,
            dataExclusao: feedback.dataExclusao ?? null,
        };
    }
    /**
     * Converte a entidade de domínio para um DTO de resposta da API.
     */
    static toResponseDTO(feedback) {
        return {
            id: feedback.id,
            formularioId: feedback.formularioId,
            envioId: feedback.envioId, // Adicionado para consistência
            resposta: feedback.respostas,
            dataCriacao: feedback.dataCriacao.toISOString(),
            dataExclusao: feedback.dataExclusao ? feedback.dataExclusao.toISOString() : undefined,
        };
    }
}
exports.FeedbackMap = FeedbackMap;
//# sourceMappingURL=feedback.map.js.map