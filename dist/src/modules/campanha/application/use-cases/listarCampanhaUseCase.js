"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarCampanhasUseCase = void 0;
const campanha_map_1 = require("@modules/campanha/infra/mappers/campanha.map");
class ListarCampanhasUseCase {
    constructor(campanhaRepository) {
        this._campanhaRepository = campanhaRepository;
    }
    async execute() {
        const campanhas = await this._campanhaRepository.listar();
        return campanhas.map(campanha => campanha_map_1.CampanhaMap.toResponseDTO(campanha));
    }
}
exports.ListarCampanhasUseCase = ListarCampanhasUseCase;
//# sourceMappingURL=listarCampanhaUseCase.js.map