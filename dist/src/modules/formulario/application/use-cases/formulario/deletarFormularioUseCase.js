"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarFormularioUseCase = void 0;
class DeletarFormularioUseCase {
    constructor(formularioRepository) {
        this._formularioRepository = formularioRepository;
    }
    async execute(id) {
        const existe = await this._formularioRepository.existe(id);
        if (!existe) {
            throw new Error(`Formulário com ID ${id} não encontrado.`);
        }
        await this._formularioRepository.deletar(id);
    }
}
exports.DeletarFormularioUseCase = DeletarFormularioUseCase;
//# sourceMappingURL=deletarFormularioUseCase.js.map