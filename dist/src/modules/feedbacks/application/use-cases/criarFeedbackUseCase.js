"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarFeedbackUseCase = void 0;
const feedback_entity_1 = require("@modules/feedbacks/domain/feedback.entity");
class CriarFeedbackUseCase {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    async execute(props) {
        // 1. Cria a entidade de domínio com os dados recebidos.
        // A entidade `Feedback` garante que os dados de entrada são válidos.
        const feedback = feedback_entity_1.Feedback.criar(props);
        // 2. Persiste a entidade no banco de dados através do repositório.
        await this.feedbackRepository.salvar(feedback);
    }
}
exports.CriarFeedbackUseCase = CriarFeedbackUseCase;
//# sourceMappingURL=criarFeedbackUseCase.js.map