"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarFeedbacksParaFormularioUseCase = void 0;
const feedback_entity_1 = require("../domain/feedback.entity");
class CriarFeedbacksParaFormularioUseCase {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    async execute(input) {
        const { formularioId, respostas } = input;
        for (const resposta of respostas) {
            const feedback = feedback_entity_1.Feedback.criarFeedback({
                formularioId,
                perguntaId: resposta.perguntaId,
                tipo: resposta.tipo,
                resposta_texto: resposta.resposta_texto,
                nota: resposta.nota,
                opcaoEscolhida: resposta.opcaoEscolhida,
            });
            await this.feedbackRepository.salvar(feedback);
        }
    }
}
exports.CriarFeedbacksParaFormularioUseCase = CriarFeedbacksParaFormularioUseCase;
//# sourceMappingURL=criarfeedbackusecase.js.map