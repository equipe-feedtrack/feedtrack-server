import { Feedback } from "../domain/feedback.entity";
import { FeedbackDTO} from "../domain/feedback.types";

class FeedbackMap {
  static toDTO(feedback: Feedback): FeedbackDTO {
    return {
      id: feedback.id,
      formularioId: feedback.formularioId,
      perguntaId: feedback.perguntaId,
      tipo: feedback.tipo,
      resposta_texto: feedback.resposta_texto,
      nota: feedback.nota,
      opcaoEscolhida: feedback.opcaoEscolhida,
      data_resposta: feedback.data_resposta,
    };
  }

  // Para reconstruir a entidade só com props (sem carregar objetos complexos)
  static toDomain(dto: FeedbackDTO): Feedback {
    return new Feedback({
      id: dto.id,
      formularioId: dto.formularioId,
      perguntaId: dto.perguntaId,
      tipo: dto.tipo,
      resposta_texto: dto.resposta_texto,
      nota: dto.nota,
      opcaoEscolhida: dto.opcaoEscolhida,
      data_resposta: dto.data_resposta,
    });
  }
}

export { FeedbackMap };