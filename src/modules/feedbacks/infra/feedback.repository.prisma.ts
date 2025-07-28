import { PrismaClient } from '@prisma/client';
import { Feedback } from '../domain/feedback.entity';
import { FeedbackMap } from './mappers/feedback.map';
import { IFeedback } from '../domain/feedback.types';
import { PrismaRepository } from '@shared/infra/prisma.repository';
import { IFeedbackRepository } from './feedback.repository';

export class FeedbackRepositoryPrisma extends PrismaRepository implements IFeedbackRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async inserir(feedback: Feedback): Promise<void> {
    const dadosParaPersistencia = FeedbackMap.toPersistence(feedback);
    await this._datasource.feedback.create({
      data: dadosParaPersistencia,
    });
  }

  async recuperarPorUuid(id: string): Promise<Feedback | null> {
    const feedbackPrisma = await this._datasource.feedback.findUnique({
      where: { id },
    });
    if (!feedbackPrisma) return null;
    return FeedbackMap.toDomain(feedbackPrisma);
  }

  async buscarPorEnvioId(envioId: string): Promise<IFeedback | null> {
    const envioFormulario = await this._datasource.envio_formulario.findUnique({
        where: { feedbackId: envioId },
        // Não precisamos incluir o Feedback aqui, apenas o ID do Feedback.
        // Se a FK de Feedback está em Envio_formulario (feedbackId String @unique),
        // então o feedbackId de Envio_formulario É o ID do Feedback.
    });

    if (!envioFormulario) return null;

    // Recupera o Feedback pelo ID encontrado no Envio_formulario
    return this.recuperarPorUuid(envioFormulario.feedbackId); 
  }
}