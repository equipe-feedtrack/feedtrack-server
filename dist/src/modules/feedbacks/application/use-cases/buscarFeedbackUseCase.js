"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarFeedbackPorEnvioUseCase = void 0;
class BuscarFeedbackPorEnvioUseCase {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    async execute(envioId) {
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
exports.BuscarFeedbackPorEnvioUseCase = BuscarFeedbackPorEnvioUseCase;
//# sourceMappingURL=buscarFeedbackUseCase.js.map