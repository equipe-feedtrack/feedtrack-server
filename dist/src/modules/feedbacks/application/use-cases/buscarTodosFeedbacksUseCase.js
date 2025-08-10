"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarTodosFeedbacksUseCase = void 0;
class BuscarTodosFeedbacksUseCase {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    async execute() {
        // 1. Busca todos os feedbacks no repositório.
        const feedbacks = await this.feedbackRepository.buscarTodos();
        // 2. Retorna a lista de entidades de domínio, que pode ser vazia.
        return feedbacks;
    }
}
exports.BuscarTodosFeedbacksUseCase = BuscarTodosFeedbacksUseCase;
//# sourceMappingURL=buscarTodosFeedbacksUseCase.js.map