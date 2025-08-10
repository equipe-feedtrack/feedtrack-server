"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarPerguntaPorIdUseCase = void 0;
const pergunta_map_1 = require("@modules/formulario/infra/mappers/pergunta.map");
class BuscarPerguntaPorIdUseCase {
    constructor(perguntaRepository) {
        this._perguntaRepository = perguntaRepository;
    }
    async execute(id) {
        // 1. Pede ao repositório para recuperar a entidade de domínio.
        const pergunta = await this._perguntaRepository.recuperarPorUuid(id);
        // 2. Se a entidade não for encontrada, retorna null.
        if (!pergunta) {
            return null;
        }
        // 3. Se encontrada, usa o mapper para converter a entidade em um DTO de resposta.
        return pergunta_map_1.PerguntaMap.toDTO(pergunta);
    }
}
exports.BuscarPerguntaPorIdUseCase = BuscarPerguntaPorIdUseCase;
//# sourceMappingURL=BuscarPerguntaPorIdUseCase.js.map