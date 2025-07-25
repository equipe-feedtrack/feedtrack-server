"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcluirFormularioUseCase = void 0;
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class ExcluirFormularioUseCase {
    constructor(formularioRepository) {
        this.formularioRepository = formularioRepository;
    }
    async execute(id) {
        // 1. Busca a entidade a ser excluída.
        const formulario = await this.formularioRepository.recuperarPorUuid(id);
        if (!formulario) {
            throw new use_case_exception_1.FormularioInexistente;
        }
        // 2. Chama um método de negócio na entidade para realizar a exclusão lógica.
        formulario.desativar();
        // 3. Salva o estado atualizado da entidade (agora inativa).
        await this.formularioRepository.inserir(formulario);
    }
}
exports.ExcluirFormularioUseCase = ExcluirFormularioUseCase;
//# sourceMappingURL=excluirFormularioUseCase.js.map