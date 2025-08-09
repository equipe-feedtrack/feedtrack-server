import { randomUUID } from "crypto";
import { PrismaClient, Feedback as FeedbackPrisma, Prisma } from "@prisma/client";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { TipoPergunta } from "@shared/domain/data.types";

import { FeedbackRepositoryPrisma } from "../feedback.repository.prisma";
import { Feedback } from "@modules/feedbacks/domain/feedback.entity";

// Mock do PrismaClient para isolar os testes do banco de dados real
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    feedback: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(), // Adicionado para mockar a função upsert
      findMany: vi.fn(),
    },
    $transaction: vi.fn(async (callback) => await callback(mockPrisma)),
  };
  return {
    PrismaClient: vi.fn(() => mockPrisma),
    Prisma: {
      JsonNull: {},
      DbNull: {},
    }
  };
});

describe("FeedbackRepositoryPrisma", () => {
  let prisma: PrismaClient;
  let repo: FeedbackRepositoryPrisma;

  beforeEach(() => {
    vi.clearAllMocks();
    prisma = new PrismaClient();
    repo = new FeedbackRepositoryPrisma(prisma);
  });

  it("deve salvar um novo feedback (upsert)", async () => {
    const feedbackId = randomUUID();
    const formularioId = randomUUID();
    const envioId = randomUUID();

    const mockFeedbackData = {
      formularioId,
      envioId,
      respostas: [{
        perguntaId: randomUUID(),
        tipo: TipoPergunta.NOTA,
        nota: 5,
        data_resposta: new Date(),
      }],
    };
    
    const feedbackEntity = Feedback.criar(mockFeedbackData, feedbackId);
    
    // Simula o comportamento de upsert
    vi.mocked(prisma.feedback.upsert).mockResolvedValue({
      id: feedbackEntity.id,
      formularioId: feedbackEntity.formularioId,
      envioId: feedbackEntity.envioId,
      resposta: JSON.parse(JSON.stringify(feedbackEntity.respostas)),
      dataCriacao: feedbackEntity.dataCriacao,
      dataExclusao: feedbackEntity.dataExclusao,
    } as FeedbackPrisma);

    await repo.salvar(feedbackEntity);

    expect(prisma.feedback.upsert).toHaveBeenCalledWith({
      where: { id: feedbackEntity.id },
      create: expect.objectContaining({
        id: feedbackId,
        formularioId,
        envioId,
        resposta: feedbackEntity.respostas,
        dataCriacao: expect.any(Date),
        dataExclusao: null,
      }),
      update: expect.objectContaining({
        resposta: feedbackEntity.respostas,
        dataExclusao: null,
      }),
    });
  });

  it("deve buscar um feedback por ID", async () => {
    const feedbackId = randomUUID();
    const mockDbResponse = {
      id: feedbackId,
      formularioId: randomUUID(),
      envioId: randomUUID(),
      resposta: [{
        perguntaId: randomUUID(),
        tipo: TipoPergunta.TEXTO,
        resposta_texto: "Teste de busca",
        data_resposta: new Date().toISOString(),
      }],
      dataCriacao: new Date(),
      dataExclusao: null,
    };

    vi.mocked(prisma.feedback.findUnique).mockResolvedValue(mockDbResponse as unknown as FeedbackPrisma);

    const result = await repo.recuperarPorUuid(feedbackId);

    expect(prisma.feedback.findUnique).toHaveBeenCalledWith({ where: { id: feedbackId } });
    expect(result).toBeInstanceOf(Feedback);
    expect(result?.id).toBe(feedbackId);
    expect(result?.respostas[0].resposta_texto).toBe("Teste de busca");
  });

  it("deve retornar null se o feedback não for encontrado por ID", async () => {
    vi.mocked(prisma.feedback.findUnique).mockResolvedValue(null);

    const result = await repo.recuperarPorUuid(randomUUID());

    expect(result).toBeNull();
  });
});
