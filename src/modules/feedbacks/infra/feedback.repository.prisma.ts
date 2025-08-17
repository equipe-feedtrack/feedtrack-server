import { PrismaClient } from "@prisma/client";
import { Feedback } from "../domain/feedback.entity";
import { IFeedbackRepository } from "./feedback.repository";
import { FeedbackMap } from "./mappers/feedback.map";

export class FeedbackRepositoryPrisma implements IFeedbackRepository {
  constructor(private readonly prisma: PrismaClient) {}
  /**
   * Salva ou atualiza um registro de Feedback.
   * Usa o método 'upsert' do Prisma para lidar com ambos os cenários de forma atômica.
   *
   * @param feedback A entidade de domínio Feedback a ser salva.
   */
  async salvar(feedback: Feedback): Promise<void> {
    const dadosParaPersistencia = FeedbackMap.toPersistence(feedback);

    const envioId = feedback.envioId;

    if (!envioId) {
      throw new Error("EnvioId é obrigatório para upsert no Feedback.");
    }

    await this.prisma.feedback.upsert({
      where: { vendaId },
      create: dadosParaPersistencia,
      update: {
        respostas: dadosParaPersistencia.respostas,
        dataExclusao: dadosParaPersistencia.dataExclusao,
        empresaId: dadosParaPersistencia.empresaId,
      },
    });
  }

  async salvarManual(feedback: Feedback): Promise<void> {
    const dadosParaPersistencia = FeedbackMap.toPersistence(feedback);

    // Aqui não precisa de envioId nem upsert, só create normal
    await this.prisma.feedback.create({
      data: dadosParaPersistencia,
    });
  }

  /**
   * Busca um registro de Feedback pelo seu ID.
   *
   * @param id O ID do feedback a ser buscado.
   * @returns A entidade de domínio Feedback ou null se não for encontrado.
   */
  async recuperarPorUuid(id: string): Promise<Feedback | null> {
    const raw = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!raw) {
      return null;
    }

    return FeedbackMap.toDomain(raw);
  }

  /**
   * Realiza a exclusão lógica de um registro de Feedback.
   *
   * @param feedback A entidade de domínio Feedback a ser excluída.
   */
  async excluirLogicamente(feedback: Feedback): Promise<void> {
    await this.prisma.feedback.update({
      where: { id: feedback.id },
      data: {
        dataExclusao: feedback.dataExclusao,
      },
    });
  }

  /**
   * Busca um Feedback pelo ID do EnvioFormulario associado.
   * No seu schema, a relação é 1:1, com a FK 'envioId' na tabela 'Feedback'.
   *
   * @param envioId O ID do envio associado ao feedback.
   * @returns A entidade de domínio Feedback ou null se não for encontrado.
   */


  async buscarTodos(empresaId?: string): Promise<Feedback[]> {
    const whereClause: any = {};

    if (empresaId) {
      whereClause.empresaId = empresaId;
    }

    const rawFeedbacks = await this.prisma.feedback.findMany({
      where: whereClause,
    });

    if (!rawFeedbacks || rawFeedbacks.length === 0) {
      return [];
    }

    // Mapeia cada objeto do Prisma para uma entidade de domínio.
    return rawFeedbacks.map(FeedbackMap.toDomain);
  }
}