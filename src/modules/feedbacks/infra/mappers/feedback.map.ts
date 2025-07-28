import { FeedbackResponseDTO } from '@modules/feedbacks/application/dto/FeedbackResponseDTO';
import { Feedback } from '@modules/feedbacks/domain/feedback.entity';
import { RecuperarFeedbackProps } from '@modules/feedbacks/domain/feedback.types';
import { Feedback as FeedbackPrisma, Prisma } from '@prisma/client'; // Feedback do Prisma Client

export class FeedbackMap {

  public static toDomain(raw: FeedbackPrisma): Feedback {
    const props: RecuperarFeedbackProps = {
      id: raw.id,
      formularioId: raw.formularioId,
      resposta: raw.resposta as Record<string, any>, // Prisma Json para TS Record
      dataCriacao: raw.data_criacao,
      dataExclusao: raw.data_exclusao ?? null,
    };
    return Feedback.recuperar(props);
  }

  public static toPersistence(feedback: Feedback) {
    return {
      id: feedback.id,
      formularioId: feedback.formularioId,
      resposta: feedback.resposta as Prisma.InputJsonValue, // Record para Prisma Json
      data_criacao: feedback.dataCriacao, // dataCriacao da entidade para data_criacao do DB
      data_exclusao: feedback.dataExclusao ?? null,
    };
  }

  public static toResponseDTO(feedback: Feedback): FeedbackResponseDTO {
    return {
      id: feedback.id,
      formularioId: feedback.formularioId,
      resposta: feedback.resposta, // O JSON de resposta vai direto para o DTO
      dataCriacao: feedback.dataCriacao.toISOString(),
      dataExclusao: feedback.dataExclusao ? feedback.dataExclusao.toISOString() : undefined,
    };
  }
}