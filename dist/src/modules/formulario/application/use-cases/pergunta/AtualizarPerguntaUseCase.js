"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarPerguntaUseCase = void 0;
const pergunta_map_1 = require("@modules/formulario/infra/mappers/pergunta.map");
class AtualizarPerguntaUseCase {
    constructor(perguntaRepository) {
        this._perguntaRepository = perguntaRepository;
    }
    async execute(input) {
        // 1. Recuperar a entidade existente do banco de dados.
        const pergunta = await this._perguntaRepository.recuperarPorUuid(input.id);
        if (!pergunta) {
            throw new Error(`Pergunta com ID ${input.id} não encontrada.`);
        }
        // 2. Aplicar as atualizações na entidade de domínio.
        if (typeof input.texto === 'string') {
            pergunta.atualizarTexto(input.texto);
        }
        // 3. Persistir a entidade atualizada no banco de dados.
        await this._perguntaRepository.atualizar(pergunta);
        // 4. Retornar o DTO de resposta com os dados atualizados.
        return pergunta_map_1.PerguntaMap.toDTO(pergunta);
    }
}
exports.AtualizarPerguntaUseCase = AtualizarPerguntaUseCase;
//# sourceMappingURL=AtualizarPerguntaUseCase.js.map