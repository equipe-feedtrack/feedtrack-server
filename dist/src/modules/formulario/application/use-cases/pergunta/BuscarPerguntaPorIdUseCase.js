"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarPerguntaPorIdUseCase = void 0;
const pergunta_map_1 = require("@modules/formulario/mappers/pergunta.map");
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class BuscarPerguntaPorIdUseCase {
    constructor(perguntaRepository) {
        this.perguntaRepository = perguntaRepository;
    }
    async execute(id) {
        // 1. Busca a entidade no repositório.
        const pergunta = await this.perguntaRepository.recuperarPorUuid(id);
        if (!pergunta) {
            throw new use_case_exception_1.UseCaseException;
        }
        // 2. Usa o Mapper para converter a entidade em um DTO seguro.
        return pergunta_map_1.PerguntaMap.toDTO(pergunta);
    }
}
exports.BuscarPerguntaPorIdUseCase = BuscarPerguntaPorIdUseCase;
//# sourceMappingURL=BuscarPerguntaPorIdUseCase.js.map