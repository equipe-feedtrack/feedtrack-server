import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { FeedbackRepositoryPrisma } from "./feedback.repository.prisma";
import { Feedback } from "../domain/feedback.entity";
import { TipoPergunta } from "@shared/domain/data.types";

vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      feedback: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
    })),
  };
});

describe("FeedbackRepositoryPrisma", () => {
  let prisma: PrismaClient;
  let repo: FeedbackRepositoryPrisma;
  let id = "b7f8c150-4d7b-4e2e-a9f7-2b9457e5a2d3";

  beforeEach(() => {
    prisma = new PrismaClient();
    repo = new FeedbackRepositoryPrisma(prisma);
  });

  it("deve salvar um feedback", async () => {
    const mockCreate = prisma.feedback.create as unknown as ReturnType<typeof vi.fn>;
    mockCreate.mockResolvedValueOnce({});

    const feedback = Feedback.criarFeedback({
      formularioId: id,
      perguntaId: id,
      tipo: TipoPergunta.TEXTO,
      resposta_texto: "Teste",
    });

    await repo.salvar(feedback);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: feedback.id,
        formularioId: id,
        resposta: {
          perguntaId: id,
          tipo: TipoPergunta.TEXTO,
          resposta_texto: "Teste",
          nota: undefined,
          opcaoEscolhida: undefined,
          data_resposta: expect.any(Date),
        },
        data_criacao: expect.any(Date),
      },
    });
  });

  it("deve buscar feedback por id", async () => {
    const mockFindUnique = prisma.feedback.findUnique as unknown as ReturnType<typeof vi.fn>;

    const dataFromDb = {
      id: id,
      formularioId: id,
      resposta: {
        perguntaId: id,
        tipo: TipoPergunta.NOTA,
        resposta_texto: null,
        nota: 8,
        opcaoEscolhida: null,
        data_resposta: new Date("2025-07-18T00:00:00Z"),
      },
      data_criacao: new Date("2025-07-18T00:00:00Z"),
    };

    mockFindUnique.mockResolvedValueOnce(dataFromDb);

    const feedback = await repo.buscarPorId(id);

    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: id } });

    expect(feedback).toBeInstanceOf(Feedback);
    expect(feedback?.id).toBe(id);
    expect(feedback?.nota).toBe(8);
    expect(feedback?.resposta_texto).toBeUndefined();
  });

  it("deve retornar null se feedback não encontrado", async () => {
    const mockFindUnique = prisma.feedback.findUnique as unknown as ReturnType<typeof vi.fn>;

    mockFindUnique.mockResolvedValueOnce(null);

    const feedback = await repo.buscarPorId("id-inexistente");

    expect(feedback).toBeNull();
  });

  it("deve buscar feedbacks por formularioId", async () => {
    const mockFindMany = prisma.feedback.findMany as unknown as ReturnType<typeof vi.fn>;

    const dataRows = [
      {
        id: id,
        formularioId: id,
        resposta: {
          perguntaId: id,
          tipo: TipoPergunta.MULTIPLA_ESCOLHA,
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

    expect(mockFindMany).toHaveBeenCalledWith({ where: { formularioId: id } });

    expect(feedbacks).toHaveLength(1);
    expect(feedbacks[0]).toBeInstanceOf(Feedback);
    expect(feedbacks[0].opcaoEscolhida).toBe("Opção 1");
  });
});
