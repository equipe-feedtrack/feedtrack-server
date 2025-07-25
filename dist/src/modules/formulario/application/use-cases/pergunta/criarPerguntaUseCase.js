"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarPerguntaUseCase = void 0;
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/domain/pergunta.entity");
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class CriarPerguntaUseCase {
    constructor(perguntaRepository, formularioRepository) {
        this.perguntaRepository = perguntaRepository;
        this.formularioRepository = formularioRepository;
    }
    async execute(dto) {
        // 1. Regra de negócio: verificar se o formulário ao qual a pergunta pertence existe.
        const formularioExiste = await this.formularioRepository.recuperarPorUuid(dto.formularioId);
        if (!formularioExiste) {
            throw new use_case_exception_1.FormularioInexistente;
        }
        // 2. Usa a fábrica da entidade para criar uma instância de domínio.
        // A fábrica já contém as validações de texto, tipo, etc.
        const pergunta = pergunta_entity_1.Pergunta.criar({
            texto: dto.texto,
            tipo: dto.tipo,
            opcoes: dto.opcoes,
        });
        // 3. Persiste a nova entidade no banco de dados.
        await this.perguntaRepository.inserir(pergunta);
        // 4. Retorna o ID da pergunta criada.
        return pergunta.id;
    }
}
exports.CriarPerguntaUseCase = CriarPerguntaUseCase;
//# sourceMappingURL=criarPerguntaUseCase.js.map