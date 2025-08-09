"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListarPerguntasUseCase = void 0;
const pergunta_map_1 = require("@modules/formulario/infra/mappers/pergunta.map");
/**
 * Caso de uso para listar perguntas com base em filtros opcionais.
 */
class ListarPerguntasUseCase {
    constructor(perguntaRepository) {
        this._perguntaRepository = perguntaRepository;
    }
    /**
     * Executa a listagem de perguntas.
     * @param filtros Um objeto opcional com os filtros a serem aplicados (ex: { ativo: true }).
     * @returns Uma promessa que resolve com um array de DTOs de pergunta.
     */
    async execute(filtros) {
        // 1. Chama o método 'listar' do repositório, passando os filtros.
        const perguntas = await this._perguntaRepository.listar(filtros);
        // 2. Mapeia a lista de entidades de domínio para uma lista de DTOs de resposta.
        return perguntas.map(pergunta => pergunta_map_1.PerguntaMap.toDTO(pergunta));
    }
}
exports.ListarPerguntasUseCase = ListarPerguntasUseCase;
//# sourceMappingURL=listar-perguntas.usecase.js.map