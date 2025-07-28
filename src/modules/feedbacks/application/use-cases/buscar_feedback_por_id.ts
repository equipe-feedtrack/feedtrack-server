import { IFeedbackRepository } from '@modules/feedbacks/infra/feedback.repository';
import { FeedbackMap } from '@modules/feedbacks/infra/mappers/feedback.map';
import { FeedbackResponseDTO } from '../dto/FeedbackResponseDTO';


export class BuscarFeedbackPorIdUseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  async execute(id: string): Promise<FeedbackResponseDTO | null> {
    const feedback = await this.feedbackRepository.recuperarPorUuid(id);

    if (!feedback) {
      // Opcional: Lançar erro em vez de retornar null se não encontrar
      // throw new FeedbackExceptions.FeedbackNaoEncontrado(id);
      return null;
    }

    return FeedbackMap.toResponseDTO(feedback);
  }
}