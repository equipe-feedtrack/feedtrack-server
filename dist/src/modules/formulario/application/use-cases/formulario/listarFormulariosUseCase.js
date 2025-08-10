"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarFormulariosUseCase = void 0;
const formulario_map_1 = require("@modules/formulario/infra/mappers/formulario.map");
class ListarFormulariosUseCase {
    constructor(formularioRepository) {
        this._formularioRepository = formularioRepository;
    }
    /**
     * Executa a listagem de formulários.
     * @param filtros Um objeto opcional com os filtros a serem aplicados.
     * @returns Uma promessa que resolve com um array de DTOs de cliente.
     */
    async execute(filtros) {
        const formularios = await this._formularioRepository.listar(filtros);
        // Mapeia a lista de entidades de domínio para uma lista de DTOs resumidos.
        return formularios.map(form => formulario_map_1.FormularioMap.toListDTO(form));
    }
}
exports.ListarFormulariosUseCase = ListarFormulariosUseCase;
//# sourceMappingURL=listarFormulariosUseCase.js.map