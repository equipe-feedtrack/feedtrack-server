"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarFormularioUseCase = void 0;
const formulario_entity_1 = require("@modules/formulario/domain/formulario/formulario.entity");
class CriarFormularioUseCase {
    constructor(formularioRepository, perguntaRepository) {
        this.formularioRepository = formularioRepository;
        this.perguntaRepository = perguntaRepository;
    }
    async execute(dto) {
        // 1. Busca as entidades de Pergunta com base nos IDs recebidos
        const perguntas = await this.perguntaRepository.buscarMuitosPorId(dto.perguntasIds);
        if (perguntas.length !== dto.perguntasIds.length) {
            throw new Error("Uma ou mais perguntas não foram encontradas.");
        }
        // 2. Cria a entidade Formulário com as perguntas encontradas
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: dto.titulo,
            descricao: dto.descricao,
            perguntas: perguntas,
        });
        // 3. Salva o formulário, e o repositório se encarrega de conectar as perguntas
        await this.formularioRepository.inserir(formulario);
        return formulario.id;
    }
}
exports.CriarFormularioUseCase = CriarFormularioUseCase;
//# sourceMappingURL=CriarFormularioUseCase.js.map