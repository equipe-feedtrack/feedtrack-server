"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarFormularioUseCase = void 0;
const formulario_entity_1 = require("@modules/formulario/domain/formulario/formulario.entity");
const formulario_map_1 = require("@modules/formulario/infra/mappers/formulario.map");
class CriarFormularioUseCase {
    constructor(formularioRepository, perguntaRepository) {
        this._formularioRepository = formularioRepository;
        this._perguntaRepository = perguntaRepository;
    }
    async execute(input) {
        // 1. Validação e Recuperação das Perguntas
        const perguntasRecuperadas = await this._perguntaRepository.buscarMuitosPorId(input.idsPerguntas);
        if (perguntasRecuperadas.length !== input.idsPerguntas.length) {
            throw new Error("Uma ou mais IDs de perguntas fornecidas são inválidas.");
        }
        // 2. Criação da Entidade de Domínio
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: input.titulo,
            descricao: input.descricao,
            ativo: input.ativo,
            perguntas: perguntasRecuperadas,
        });
        // 3. Persistência no Banco de Dados
        await this._formularioRepository.inserir(formulario);
        // 4. Retorno do DTO de Saída
        return formulario_map_1.FormularioMap.toResponseDTO(formulario);
    }
}
exports.CriarFormularioUseCase = CriarFormularioUseCase;
//# sourceMappingURL=CriarFormularioUseCase.js.map