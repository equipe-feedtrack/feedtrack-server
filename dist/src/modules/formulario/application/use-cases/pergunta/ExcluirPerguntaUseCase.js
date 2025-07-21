"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcluirPerguntaUseCase = void 0;
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class ExcluirPerguntaUseCase {
    constructor(perguntaRepository) {
        this.perguntaRepository = perguntaRepository;
    }
    async execute(id) {
        // 1. Busca a entidade a ser excluída.
        const pergunta = await this.perguntaRepository.recuperarPorUuid(id);
        if (!pergunta) {
            throw new use_case_exception_1.UseCaseException;
        }
        // 2. Chama um método de negócio na entidade para realizar a exclusão lógica.
        // (Supondo que a entidade tenha um método 'inativar')
        pergunta.inativar();
        // 3. Salva o estado atualizado da entidade (agora inativa).
        await this.perguntaRepository.inserir(pergunta);
    }
}
exports.ExcluirPerguntaUseCase = ExcluirPerguntaUseCase;
//# sourceMappingURL=ExcluirPerguntaUseCase.js.map