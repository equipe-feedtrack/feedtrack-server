"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarPerguntaUseCase = void 0;
const pergunta_map_1 = require("@modules/formulario/infra/mappers/pergunta.map");
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/pergunta.entity");
class CriarPerguntaUseCase {
    constructor(perguntaRepository) {
        this._perguntaRepository = perguntaRepository;
    }
    async execute(input) {
        // 1. Usa o método de fábrica da entidade para criar uma nova instância de Pergunta.
        // A entidade é responsável por validar todas as regras de negócio.
        const pergunta = pergunta_entity_1.Pergunta.criar(input);
        // 2. Persiste a nova entidade no banco de dados.
        await this._perguntaRepository.inserir(pergunta);
        // 3. Retorna um DTO com os dados da pergunta criada.
        return pergunta_map_1.PerguntaMap.toDTO(pergunta);
    }
}
exports.CriarPerguntaUseCase = CriarPerguntaUseCase;
//# sourceMappingURL=criarPerguntaUseCase.js.map