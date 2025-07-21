"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarPerguntaUseCase = void 0;
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class AtualizarPerguntaUseCase {
    constructor(perguntaRepository) {
        this.perguntaRepository = perguntaRepository;
    }
    async execute(id, dto) {
        // 1. Busca a entidade que será atualizada.
        const pergunta = await this.perguntaRepository.recuperarPorUuid(id);
        if (!pergunta) {
            throw new use_case_exception_1.UseCaseException('Pergunta não encontrada.');
        }
        // 2. Chama os métodos de negócio da própria entidade para alterar o estado.
        // (Supondo que a entidade Pergunta tenha métodos como estes)
        // if (dto.texto) {
        //   pergunta.alterarTexto(dto.texto);
        // }
        // if (dto.tipo) {
        //   pergunta.alterarTipoEopcoes(dto.tipo, dto.opcoes);
        // }
        // 3. Salva a entidade com seu novo estado.
        await this.perguntaRepository.inserir(pergunta);
    }
}
exports.AtualizarPerguntaUseCase = AtualizarPerguntaUseCase;
//# sourceMappingURL=AtualizarPerguntaUseCase.js.map