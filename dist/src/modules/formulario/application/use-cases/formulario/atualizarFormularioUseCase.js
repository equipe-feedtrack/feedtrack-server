"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarFormularioUseCase = void 0;
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/domain/pergunta.entity");
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class AtualizarFormularioUseCase {
    constructor(formularioRepository) {
        this.formularioRepository = formularioRepository;
    }
    async execute(id, dto) {
        // 1. Busca a entidade que será atualizada.
        const formulario = await this.formularioRepository.recuperarPorUuid(id);
        if (!formulario) {
            throw new use_case_exception_1.FormularioInexistente;
        }
        // 2. Chama os métodos de negócio da entidade para alterar o estado.
        formulario.atualizarTitulo(dto.titulo);
        formulario.atualizarDescricao(dto.descricao);
        // 3. Cria as novas instâncias de Pergunta que substituirão as antigas.
        const novasPerguntas = dto.perguntas.map(p => pergunta_entity_1.Pergunta.criar({
            texto: p.texto,
            tipo: p.tipo,
            opcoes: p.opcoes,
        }));
        // 4. Chama um método na entidade Formulário para atualizar as perguntas.
        formulario.substituirPerguntas(novasPerguntas);
        // 5. Salva a entidade com seu novo estado.
        await this.formularioRepository.inserir(formulario);
    }
}
exports.AtualizarFormularioUseCase = AtualizarFormularioUseCase;
//# sourceMappingURL=atualizarFormularioUseCase.js.map