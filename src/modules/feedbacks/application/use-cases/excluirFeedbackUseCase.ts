import { IFeedbackRepository } from "@modules/feedbacks/infra/feedback.repository";

export class ExcluirLogicamenteFeedbackUseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  public async execute(feedbackId: string): Promise<void> {
    // 1. Busca a entidade de domínio pelo seu ID.
    const feedback = await this.feedbackRepository.recuperarPorUuid(feedbackId);

    // 2. Se o feedback não for encontrado, lança um erro ou simplesmente retorna.
    if (!feedback) {
      // Exemplo de como lidar com o erro.
      throw new Error(`Feedback com o ID ${feedbackId} não encontrado.`);
    }

    // 3. Executa a lógica de exclusão na própria entidade de domínio.
    feedback.excluirLogicamente();

    // 4. Salva a entidade atualizada no banco de dados.
    await this.feedbackRepository.salvar(feedback);
  }
}