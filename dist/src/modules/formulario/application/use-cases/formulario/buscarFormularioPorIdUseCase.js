"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarFormularioPorIdUseCase = void 0;
const formulario_map_1 = require("@modules/formulario/mappers/formulario.map");
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class BuscarFormularioPorIdUseCase {
    constructor(formularioRepository) {
        this.formularioRepository = formularioRepository;
    }
    async execute(id) {
        // 1. Busca a entidade no repositório, incluindo suas perguntas.
        const formulario = await this.formularioRepository.recuperarPorUuid(id);
        if (!formulario) {
            throw new use_case_exception_1.FormularioInexistente;
        }
        // 2. Usa o Mapper para converter a entidade em um DTO de resposta detalhado.
        return formulario_map_1.FormularioMap.toResponseDTO(formulario);
    }
}
exports.BuscarFormularioPorIdUseCase = BuscarFormularioPorIdUseCase;
//# sourceMappingURL=buscarFormularioPorIdUseCase.js.map