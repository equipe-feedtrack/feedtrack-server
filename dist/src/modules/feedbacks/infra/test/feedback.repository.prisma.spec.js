"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const data_types_1 = require("@shared/domain/data.types");
const feedback_repository_prisma_1 = require("../feedback.repository.prisma");
const feedback_entity_1 = require("@modules/feedbacks/domain/feedback.entity");
// Mock do PrismaClient para isolar os testes do banco de dados real
vitest_1.vi.mock("@prisma/client", () => {
    const mockPrisma = {
        feedback: {
            create: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
            upsert: vitest_1.vi.fn(), // Adicionado para mockar a função upsert
            findMany: vitest_1.vi.fn(),
        },
        $transaction: vitest_1.vi.fn(async (callback) => await callback(mockPrisma)),
    };
    return {
        PrismaClient: vitest_1.vi.fn(() => mockPrisma),
    };
});
(0, vitest_1.describe)("FeedbackRepositoryPrisma", () => {
    let prisma;
    let repo;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        prisma = new client_1.PrismaClient();
        repo = new feedback_repository_prisma_1.FeedbackRepositoryPrisma(prisma);
    });
    (0, vitest_1.it)("deve salvar um novo feedback (upsert)", async () => {
        const feedbackId = (0, crypto_1.randomUUID)();
        const formularioId = (0, crypto_1.randomUUID)();
        const envioId = (0, crypto_1.randomUUID)();
        const mockFeedbackData = {
            formularioId,
            envioId,
            respostas: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.NOTA,
                    nota: 5,
                    data_resposta: new Date(),
                }],
        };
        const feedbackEntity = feedback_entity_1.Feedback.criar(mockFeedbackData, feedbackId);
        // Simula o comportamento de upsert
        vitest_1.vi.mocked(prisma.feedback.upsert).mockResolvedValue({
            id: feedbackEntity.id,
            formularioId: feedbackEntity.formularioId,
            envioId: feedbackEntity.envioId,
            resposta: feedbackEntity.respostas,
            dataCriacao: feedbackEntity.dataCriacao,
            dataExclusao: feedbackEntity.dataExclusao,
        });
        await repo.salvar(feedbackEntity);
        (0, vitest_1.expect)(prisma.feedback.upsert).toHaveBeenCalledWith({
            where: { id: feedbackEntity.id },
            create: vitest_1.expect.objectContaining({
                id: feedbackId,
                formularioId,
                envioId,
                resposta: feedbackEntity.respostas,
                dataCriacao: vitest_1.expect.any(Date),
                dataExclusao: null,
            }),
            update: vitest_1.expect.objectContaining({
                resposta: feedbackEntity.respostas,
                dataExclusao: null,
            }),
        });
    });
    (0, vitest_1.it)("deve buscar um feedback por ID", async () => {
        const feedbackId = (0, crypto_1.randomUUID)();
        const mockDbResponse = {
            id: feedbackId,
            formularioId: (0, crypto_1.randomUUID)(),
            envioId: (0, crypto_1.randomUUID)(),
            resposta: [{
                    perguntaId: (0, crypto_1.randomUUID)(),
                    tipo: data_types_1.TipoPergunta.TEXTO,
                    resposta_texto: "Teste de busca",
                    data_resposta: new Date(),
                }],
            dataCriacao: new Date(),
            dataExclusao: null,
        };
        vitest_1.vi.mocked(prisma.feedback.findUnique).mockResolvedValue(mockDbResponse);
        const result = await repo.recuperarPorUuid(feedbackId);
        (0, vitest_1.expect)(prisma.feedback.findUnique).toHaveBeenCalledWith({ where: { id: feedbackId } });
        (0, vitest_1.expect)(result).toBeInstanceOf(feedback_entity_1.Feedback);
        (0, vitest_1.expect)(result?.id).toBe(feedbackId);
        (0, vitest_1.expect)(result?.respostas[0].resposta_texto).toBe("Teste de busca");
    });
    (0, vitest_1.it)("deve retornar null se o feedback não for encontrado por ID", async () => {
        vitest_1.vi.mocked(prisma.feedback.findUnique).mockResolvedValue(null);
        const result = await repo.recuperarPorUuid((0, crypto_1.randomUUID)());
        (0, vitest_1.expect)(result).toBeNull();
    });
});
//# sourceMappingURL=feedback.repository.prisma.spec.js.map