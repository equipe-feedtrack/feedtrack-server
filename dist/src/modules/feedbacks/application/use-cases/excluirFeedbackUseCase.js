"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcluirLogicamenteFeedbackUseCase = void 0;
class ExcluirLogicamenteFeedbackUseCase {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    async execute(feedbackId) {
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
exports.ExcluirLogicamenteFeedbackUseCase = ExcluirLogicamenteFeedbackUseCase;
//# sourceMappingURL=excluirFeedbackUseCase.js.map