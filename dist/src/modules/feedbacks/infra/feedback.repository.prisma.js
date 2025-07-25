"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRepositoryPrisma = void 0;
const feedback_entity_1 = require("../domain/feedback.entity");
class FeedbackRepositoryPrisma {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async salvar(feedback) {
        await this.prisma.feedback.create({
            data: {
                id: feedback.id,
                formularioId: feedback.formularioId,
                resposta: {
                    perguntaId: feedback.perguntaId,
                    tipo: feedback.tipo,
                    resposta_texto: feedback.resposta_texto,
                    nota: feedback.nota,
                    opcaoEscolhida: feedback.opcaoEscolhida,
                    data_resposta: feedback.data_resposta,
                },
                data_criacao: feedback.data_resposta,
            },
        });
    }
    async buscarPorId(id) {
        const data = await this.prisma.feedback.findUnique({
            where: { id },
        });
        if (!data)
            return null;
        const resposta = data.resposta;
        return new feedback_entity_1.Feedback({
            id: data.id,
            formularioId: data.formularioId,
            perguntaId: resposta.perguntaId,
            tipo: resposta.tipo,
            resposta_texto: resposta.resposta_texto,
            nota: resposta.nota,
            opcaoEscolhida: resposta.opcaoEscolhida,
            data_resposta: resposta.data_resposta || data.data_criacao,
        });
    }
    async buscarPorFormulario(formularioId) {
        const rows = await this.prisma.feedback.findMany({
            where: { formularioId },
        });
        return rows.map((row) => {
            const resposta = row.resposta;
            return new feedback_entity_1.Feedback({
                id: row.id,
                formularioId: row.formularioId,
                perguntaId: resposta.perguntaId,
                tipo: resposta.tipo,
                resposta_texto: resposta.resposta_texto,
                nota: resposta.nota,
                opcaoEscolhida: resposta.opcaoEscolhida,
                data_resposta: resposta.data_resposta || row.data_criacao,
            });
        });
    }
}
exports.FeedbackRepositoryPrisma = FeedbackRepositoryPrisma;
//# sourceMappingURL=feedback.repository.prisma.js.map