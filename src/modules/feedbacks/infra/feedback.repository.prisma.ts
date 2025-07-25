import { PrismaClient, Feedback as PrismaFeedback } from "@prisma/client";
import { Feedback } from "../domain/feedback.entity";
import { FeedbackRepository } from "./feedback.repository";
import { TipoPergunta } from "@shared/domain/data.types";

export class FeedbackRepositoryPrisma implements FeedbackRepository {

  constructor(private readonly prisma: PrismaClient) {}
  async salvar(feedback: Feedback): Promise<void> {
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

  async buscarPorId(id: string): Promise<Feedback | null> {
    const data = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!data) return null;

    const resposta = data.resposta as any;

    return new Feedback({
      id: data.id,
      formularioId: data.formularioId,
      perguntaId: resposta.perguntaId,
      tipo: resposta.tipo as TipoPergunta,
      resposta_texto: resposta.resposta_texto,
      nota: resposta.nota,
      opcaoEscolhida: resposta.opcaoEscolhida,
      data_resposta: resposta.data_resposta || data.data_criacao,
    });
  }

  async buscarPorFormulario(formularioId: string): Promise<Feedback[]> {
    const rows = await this.prisma.feedback.findMany({
      where: { formularioId },
    });

    return rows.map((row) => {
      const resposta = row.resposta as any;

      return new Feedback({
        id: row.id,
        formularioId: row.formularioId,
        perguntaId: resposta.perguntaId,
        tipo: resposta.tipo as TipoPergunta,
        resposta_texto: resposta.resposta_texto,
        nota: resposta.nota,
        opcaoEscolhida: resposta.opcaoEscolhida,
        data_resposta: resposta.data_resposta || row.data_criacao,
      });
    });
  }
}