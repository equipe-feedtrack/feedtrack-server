"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarCampanhaUseCase = void 0;
const campanha_map_1 = require("@modules/campanha/infra/mappers/campanha.map");
class AtualizarCampanhaUseCase {
    constructor(campanhaRepository) {
        this._campanhaRepository = campanhaRepository;
    }
    async execute(input) {
        // 1. Recuperar a entidade
        const campanha = await this._campanhaRepository.recuperarPorUuid(input.id);
        if (!campanha) {
            throw new Error(`Campanha com ID ${input.id} não encontrada.`);
        }
        if (input.ativo !== undefined) {
            if (input.ativo) {
                campanha.ativar();
            }
            else {
                campanha.desativar();
            }
        }
        // 3. Persistir a entidade atualizada
        await this._campanhaRepository.atualizar(campanha);
        // 4. Retornar o DTO de resposta
        return campanha_map_1.CampanhaMap.toResponseDTO(campanha);
    }
}
exports.AtualizarCampanhaUseCase = AtualizarCampanhaUseCase;
//# sourceMappingURL=atualizarCampanhaUseCase.js.map