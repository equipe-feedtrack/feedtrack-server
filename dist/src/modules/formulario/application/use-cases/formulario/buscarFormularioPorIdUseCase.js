"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarFormularioPorIdUseCase = void 0;
const formulario_map_1 = require("@modules/formulario/infra/mappers/formulario.map");
class BuscarFormularioPorIdUseCase {
    constructor(formularioRepository) {
        this._formularioRepository = formularioRepository;
    }
    async execute(id) {
        const formulario = await this._formularioRepository.recuperarPorUuid(id);
        if (!formulario) {
            return null;
        }
        return formulario_map_1.FormularioMap.toResponseDTO(formulario);
    }
}
exports.BuscarFormularioPorIdUseCase = BuscarFormularioPorIdUseCase;
//# sourceMappingURL=buscarFormularioPorIdUseCase.js.map