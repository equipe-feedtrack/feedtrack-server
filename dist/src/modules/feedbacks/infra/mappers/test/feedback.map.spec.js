"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const crypto_1 = require("crypto");
const data_types_1 = require("@shared/domain/data.types");
const feedback_entity_1 = require("@modules/feedbacks/domain/feedback.entity");
const feedback_map_1 = require("../feedback.map");
(0, vitest_1.describe)("FeedbackMap", () => {
    // Gerando UUIDs para os testes
    const formularioId = (0, crypto_1.randomUUID)();
    const envioId = (0, crypto_1.randomUUID)();
    const feedbackId = (0, crypto_1.randomUUID)();
    // Dados de exemplo para a entidade de domínio
    const feedbackData = {
        formularioId,
        envioId,
        respostas: [
            {
                perguntaId: (0, crypto_1.randomUUID)(),
                tipo: data_types_1.TipoPergunta.NOTA,
                nota: 5,
                data_resposta: new Date(),
            },
            {
                perguntaId: (0, crypto_1.randomUUID)(),
                tipo: data_types_1.TipoPergunta.TEXTO,
                resposta_texto: "Ótimo serviço!",
                data_resposta: new Date(),
            }
        ],
    };
    const feedbackEntity = feedback_entity_1.Feedback.criar(feedbackData, feedbackId);
    // Dados de exemplo para o objeto do Prisma
    const feedbackPrisma = {
        id: feedbackId,
        formularioId,
        envioId,
        resposta: feedbackData.respostas,
        dataCriacao: feedbackEntity.dataCriacao,
        dataExclusao: null,
    };
    (0, vitest_1.it)("deve converter um objeto do Prisma para a entidade de domínio", () => {
        // Simulando a recuperação de um objeto JSON do banco, com datas como strings
        const rawDataWithIsoString = {
            ...feedbackPrisma,
            respostas: feedbackPrisma.resposta.map((r) => ({
                ...r,
                data_resposta: r.data_resposta.toISOString(),
            })),
        };
        // Convertendo as strings de data de volta para objetos Date
        const domainEntity = feedback_map_1.FeedbackMap.toDomain({
            ...rawDataWithIsoString,
            resposta: rawDataWithIsoString.respostas.map((r) => ({
                ...r,
                data_resposta: new Date(r.data_resposta),
            })),
        });
        (0, vitest_1.expect)(domainEntity).toBeInstanceOf(feedback_entity_1.Feedback);
        (0, vitest_1.expect)(domainEntity.id).toBe(feedbackId);
        (0, vitest_1.expect)(domainEntity.formularioId).toBe(formularioId);
        (0, vitest_1.expect)(domainEntity.envioId).toBe(envioId);
        (0, vitest_1.expect)(domainEntity.respostas).toHaveLength(2);
        (0, vitest_1.expect)(domainEntity.respostas[0].perguntaId).toBe(feedbackData.respostas[0].perguntaId);
        (0, vitest_1.expect)(domainEntity.dataCriacao).toEqual(feedbackPrisma.dataCriacao);
    });
    (0, vitest_1.it)("deve converter uma entidade de domínio para o formato de persistência do Prisma", () => {
        const persistenceData = feedback_map_1.FeedbackMap.toPersistence(feedbackEntity);
        (0, vitest_1.expect)(persistenceData.id).toBe(feedbackId);
        (0, vitest_1.expect)(persistenceData.formularioId).toBe(formularioId);
        (0, vitest_1.expect)(persistenceData.envioId).toBe(envioId);
        (0, vitest_1.expect)(persistenceData.resposta).toHaveLength(2);
        (0, vitest_1.expect)(persistenceData.resposta[0].perguntaId).toBe(feedbackData.respostas[0].perguntaId);
        (0, vitest_1.expect)(persistenceData.dataCriacao).toEqual(feedbackEntity.dataCriacao);
        (0, vitest_1.expect)(persistenceData.dataExclusao).toBeNull();
    });
});
//# sourceMappingURL=feedback.map.spec.js.map