"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarCampanhaUseCase = void 0;
class DeletarCampanhaUseCase {
    constructor(campanhaRepository) {
        this._campanhaRepository = campanhaRepository;
    }
    async execute(id) {
        const existe = await this._campanhaRepository.existe(id);
        if (!existe) {
            throw new Error(`Campanha com ID ${id} não encontrada.`);
        }
        await this._campanhaRepository.deletar(id);
    }
}
exports.DeletarCampanhaUseCase = DeletarCampanhaUseCase;
//# sourceMappingURL=deletarCampanhaUseCase.js.map