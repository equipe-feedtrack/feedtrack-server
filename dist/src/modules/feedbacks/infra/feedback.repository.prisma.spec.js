"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("@prisma/client");
const feedback_repository_prisma_1 = require("./feedback.repository.prisma");
const feedback_entity_1 = require("../domain/feedback.entity");
const data_types_1 = require("@shared/domain/data.types");
vitest_1.vi.mock("@prisma/client", () => {
    return {
        PrismaClient: vitest_1.vi.fn().mockImplementation(() => ({
            feedback: {
                create: vitest_1.vi.fn(),
                findUnique: vitest_1.vi.fn(),
                findMany: vitest_1.vi.fn(),
            },
        })),
    };
});
(0, vitest_1.describe)("FeedbackRepositoryPrisma", () => {
    let prisma;
    let repo;
    let id = "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3";
    (0, vitest_1.beforeEach)(() => {
        prisma = new client_1.PrismaClient();
        repo = new feedback_repository_prisma_1.FeedbackRepositoryPrisma(prisma);
    });
    (0, vitest_1.it)("deve salvar um feedback", async () => {
        const mockCreate = prisma.feedback.create;
        mockCreate.mockResolvedValueOnce({});
        const feedback = feedback_entity_1.Feedback.criarFeedback({
            formularioId: id,
            perguntaId: id,
            tipo: data_types_1.TipoPergunta.TEXTO,
            resposta_texto: "Teste",
        });
        await repo.salvar(feedback);
        (0, vitest_1.expect)(mockCreate).toHaveBeenCalledWith({
            data: {
                id: feedback.id,
                formularioId: id,
                resposta: {
                    perguntaId: id,
                    tipo: data_types_1.TipoPergunta.TEXTO,
                    resposta_texto: "Teste",
                    nota: undefined,
                    opcaoEscolhida: undefined,
                    data_resposta: vitest_1.expect.any(Date),
                },
                data_criacao: vitest_1.expect.any(Date),
            },
        });
    });
    (0, vitest_1.it)("deve buscar feedback por id", async () => {
        const mockFindUnique = prisma.feedback.findUnique;
        const dataFromDb = {
            id: id,
            formularioId: id,
            resposta: {
                perguntaId: id,
                tipo: data_types_1.TipoPergunta.NOTA,
                resposta_texto: null,
                nota: 8,
                opcaoEscolhida: null,
                data_resposta: new Date("2025-07-18T00:00:00Z"),
            },
            data_criacao: new Date("2025-07-18T00:00:00Z"),
        };
        mockFindUnique.mockResolvedValueOnce(dataFromDb);
        const feedback = await repo.buscarPorId(id);
        (0, vitest_1.expect)(mockFindUnique).toHaveBeenCalledWith({ where: { id: id } });
        (0, vitest_1.expect)(feedback).toBeInstanceOf(feedback_entity_1.Feedback);
        (0, vitest_1.expect)(feedback?.id).toBe(id);
        (0, vitest_1.expect)(feedback?.nota).toBe(8);
        (0, vitest_1.expect)(feedback?.resposta_texto).toBeUndefined();
    });
    (0, vitest_1.it)("deve retornar null se feedback não encontrado", async () => {
        const mockFindUnique = prisma.feedback.findUnique;
        mockFindUnique.mockResolvedValueOnce(null);
        const feedback = await repo.buscarPorId("id-inexistente");
        (0, vitest_1.expect)(feedback).toBeNull();
    });
    (0, vitest_1.it)("deve buscar feedbacks por formularioId", async () => {
        const mockFindMany = prisma.feedback.findMany;
        const dataRows = [
            {
                id: id,
                formularioId: id,
                resposta: {
                    perguntaId: id,
                    tipo: data_types_1.TipoPergunta.MULTIPLA_ESCOLHA,
                    resposta_texto: null,
                    nota: null,
                    opcaoEscolhida: "Opção 1",
                    data_resposta: new Date("2025-07-18T00:00:00Z"),
                },
                data_criacao: new Date("2025-07-18T00:00:00Z"),
            },
        ];
        mockFindMany.mockResolvedValueOnce(dataRows);
        const feedbacks = await repo.buscarPorFormulario(id);
        (0, vitest_1.expect)(mockFindMany).toHaveBeenCalledWith({ where: { formularioId: id } });
        (0, vitest_1.expect)(feedbacks).toHaveLength(1);
        (0, vitest_1.expect)(feedbacks[0]).toBeInstanceOf(feedback_entity_1.Feedback);
        (0, vitest_1.expect)(feedbacks[0].opcaoEscolhida).toBe("Opção 1");
    });
});
//# sourceMappingURL=feedback.repository.prisma.spec.js.map