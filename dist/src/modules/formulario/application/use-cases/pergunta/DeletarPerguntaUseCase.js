"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarPerguntaUseCase = void 0;
class DeletarPerguntaUseCase {
    constructor(perguntaRepository) {
        this._perguntaRepository = perguntaRepository;
    }
    async execute(id) {
        // 1. Verificar se a pergunta existe antes de tentar deletar.
        const existe = await this._perguntaRepository.existe(id);
        if (!existe) {
            throw new Error(`Pergunta com ID ${id} não encontrada.`);
        }
        // 2. Chamar o repositório para deletar a pergunta.
        // O repositório é responsável por lidar com a remoção de associações.
        await this._perguntaRepository.deletar(id);
    }
}
exports.DeletarPerguntaUseCase = DeletarPerguntaUseCase;
//# sourceMappingURL=DeletarPerguntaUseCase.js.map