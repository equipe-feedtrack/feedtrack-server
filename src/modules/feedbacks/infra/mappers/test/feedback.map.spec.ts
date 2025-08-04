import { describe, it, expect } from "vitest";
import { randomUUID } from "crypto";

import { TipoPergunta } from "@shared/domain/data.types";
import { Feedback as FeedbackPrisma } from "@prisma/client";
import { Feedback } from "@modules/feedbacks/domain/feedback.entity";
import { FeedbackMap } from "../feedback.map";

describe("FeedbackMap", () => {
    // Gerando UUIDs para os testes
    const formularioId = randomUUID();
    const envioId = randomUUID();
    const feedbackId = randomUUID();

    // Dados de exemplo para a entidade de domínio
    const feedbackData = {
        formularioId,
        envioId,
        respostas: [
            {
                perguntaId: randomUUID(),
                tipo: TipoPergunta.NOTA,
                nota: 5,
                data_resposta: new Date(),
            },
            {
                perguntaId: randomUUID(),
                tipo: TipoPergunta.TEXTO,
                resposta_texto: "Ótimo serviço!",
                data_resposta: new Date(),
            }
        ],
    };

    const feedbackEntity = Feedback.criar(feedbackData, feedbackId);

    // Dados de exemplo para o objeto do Prisma
    const feedbackPrisma: FeedbackPrisma = {
        id: feedbackId,
        formularioId,
        envioId,
        resposta: feedbackData.respostas as any,
        dataCriacao: feedbackEntity.dataCriacao,
        dataExclusao: null,
    };

    it("deve converter um objeto do Prisma para a entidade de domínio", () => {
        // Simulando a recuperação de um objeto JSON do banco, com datas como strings
        const rawDataWithIsoString = {
            ...feedbackPrisma,
            respostas: (feedbackPrisma.resposta as any).map((r: any) => ({
                ...r,
                data_resposta: r.data_resposta.toISOString(),
            })),
        };

        // Convertendo as strings de data de volta para objetos Date
        const domainEntity = FeedbackMap.toDomain({
            ...rawDataWithIsoString,
            resposta: (rawDataWithIsoString.respostas as any).map((r: any) => ({
                ...r,
                data_resposta: new Date(r.data_resposta),
            })),
        });

        expect(domainEntity).toBeInstanceOf(Feedback);
        expect(domainEntity.id).toBe(feedbackId);
        expect(domainEntity.formularioId).toBe(formularioId);
        expect(domainEntity.envioId).toBe(envioId);
        expect(domainEntity.respostas).toHaveLength(2);
        expect(domainEntity.respostas[0].perguntaId).toBe(feedbackData.respostas[0].perguntaId);
        expect(domainEntity.dataCriacao).toEqual(feedbackPrisma.dataCriacao);
    });

    it("deve converter uma entidade de domínio para o formato de persistência do Prisma", () => {
        const persistenceData = FeedbackMap.toPersistence(feedbackEntity);

        expect(persistenceData.id).toBe(feedbackId);
        expect(persistenceData.formularioId).toBe(formularioId);
        expect(persistenceData.envioId).toBe(envioId);
        expect(persistenceData.resposta).toHaveLength(2);
        expect((persistenceData.resposta as any)[0].perguntaId).toBe(feedbackData.respostas[0].perguntaId);
        expect(persistenceData.dataCriacao).toEqual(feedbackEntity.dataCriacao);
        expect(persistenceData.dataExclusao).toBeNull();
    });
});
