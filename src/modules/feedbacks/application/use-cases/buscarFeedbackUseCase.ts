import { Feedback } from "@modules/feedbacks/domain/feedback.entity";
import { IFeedbackRepository } from "@modules/feedbacks/infra/feedback.repository";

export class BuscarFeedbackPorEnvioUseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  public async execute(envioId: string): Promise<Feedback | null> {
    // 1. Busca o feedback no repositório usando o ID do envio.
    const feedback = await this.feedbackRepository.recuperarPorUuid(envioId);
    
    // 2. Se não encontrar, retorna null.
    if (!feedback) {
      return null;
    }
    
    // 3. Retorna a entidade de domínio encontrada.
    return feedback;
  }
}