import { Feedback } from "@modules/feedbacks/domain/feedback.entity";
import { CriarFeedbackProps } from "@modules/feedbacks/domain/feedback.types";
import { IFeedbackRepository } from "@modules/feedbacks/infra/feedback.repository";

export class CriarFeedbackUseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  public async execute(props: CriarFeedbackProps): Promise<void> {
    // 1. Cria a entidade de domínio com os dados recebidos.
    // A entidade `Feedback` garante que os dados de entrada são válidos.
    const feedback = Feedback.criar(props);

    // 2. Persiste a entidade no banco de dados através do repositório.
    await this.feedbackRepository.salvar(feedback);
  }
}