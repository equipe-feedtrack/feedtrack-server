import { Feedback } from "@modules/feedbacks/domain/feedback.entity";
import { IFeedbackRepository } from "@modules/feedbacks/infra/feedback.repository";

export class BuscarTodosFeedbacksUseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  public async execute(empresaId: string): Promise<Feedback[]> {
    // 1. Busca todos os feedbacks no repositório.
    const feedbacks = await this.feedbackRepository.buscarTodos(empresaId);
    
    // 2. Retorna a lista de entidades de domínio, que pode ser vazia.
    return feedbacks;
  }
}