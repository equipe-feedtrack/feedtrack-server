"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarFormularioUseCase = void 0;
const formulario_map_1 = require("@modules/formulario/infra/mappers/formulario.map");
class AtualizarFormularioUseCase {
    constructor(formularioRepository, perguntaRepository) {
        this._formularioRepository = formularioRepository;
        this._perguntaRepository = perguntaRepository;
    }
    async execute(input) {
        // 1. Recuperar a entidade existente.
        const formulario = await this._formularioRepository.recuperarPorUuid(input.id);
        if (!formulario) {
            throw new Error(`Formulário com ID ${input.id} não encontrado.`);
        }
        // 2. Aplicar as atualizações na entidade de domínio.
        if (typeof input.titulo === 'string') {
            formulario.atualizarTitulo(input.titulo);
        }
        // Adicionar outros métodos de atualização para descricao, ativo, etc.
        // 3. Sincronizar a lista de perguntas, se fornecida.
        if (Array.isArray(input.idsPerguntas)) {
            const perguntasRecuperadas = await this._perguntaRepository.buscarMuitosPorId(input.idsPerguntas);
            if (perguntasRecuperadas.length !== input.idsPerguntas.length) {
                throw new Error("Uma ou mais IDs de perguntas fornecidas são inválidas.");
            }
            // Remove todas as perguntas antigas e adiciona as novas
            const perguntasAtuaisIds = formulario.perguntas.map(p => p.id);
            for (const id of perguntasAtuaisIds) {
                formulario.removerPergunta(id);
            }
            for (const pergunta of perguntasRecuperadas) {
                formulario.adicionarPergunta(pergunta);
            }
        }
        // 4. Persistir a entidade atualizada.
        await this._formularioRepository.atualizar(formulario);
        // 5. Retornar o DTO de resposta.
        return formulario_map_1.FormularioMap.toResponseDTO(formulario);
    }
}
exports.AtualizarFormularioUseCase = AtualizarFormularioUseCase;
//# sourceMappingURL=atualizarFormularioUseCase.js.map