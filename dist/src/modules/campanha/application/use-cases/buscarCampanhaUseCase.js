"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarCampanhaPorIdUseCase = void 0;
const campanha_map_1 = require("@modules/campanha/infra/mappers/campanha.map");
class BuscarCampanhaPorIdUseCase {
    constructor(campanhaRepository) {
        this._campanhaRepository = campanhaRepository;
    }
    async execute(id) {
        const campanha = await this._campanhaRepository.recuperarPorUuid(id);
        if (!campanha) {
            return null;
        }
        return campanha_map_1.CampanhaMap.toResponseDTO(campanha);
    }
}
exports.BuscarCampanhaPorIdUseCase = BuscarCampanhaPorIdUseCase;
//# sourceMappingURL=buscarCampanhaUseCase.js.map