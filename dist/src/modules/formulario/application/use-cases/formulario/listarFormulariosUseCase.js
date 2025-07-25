"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarFormulariosUseCase = void 0;
const formulario_map_1 = require("@modules/formulario/mappers/formulario.map");
class ListarFormulariosUseCase {
    constructor(formularioRepository) {
        this.formularioRepository = formularioRepository;
    }
    async execute(request) {
        // 1. Busca a lista de entidades no repositório com filtros opcionais.
        const formularios = await this.formularioRepository.listar({
            ativo: request.apenasAtivos,
        });
        // 2. Mapeia cada entidade da lista para seu DTO de lista correspondente.
        return formularios.map(formulario_map_1.FormularioMap.toListDTO);
    }
}
exports.ListarFormulariosUseCase = ListarFormulariosUseCase;
//# sourceMappingURL=listarFormulariosUseCase.js.map