"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioTituloVazioException = exports.FormularioException = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class FormularioException extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de Domínio Genérica da Entidade Formulario') {
        super(message);
        this.name = 'FormularioException';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.FormularioException = FormularioException;
class FormularioTituloVazioException extends FormularioException {
    constructor(message = '⚠️ O título do formulário é obrigatório.') {
        super(message);
        this.name = 'FormularioTituloVazioException ';
        this.message = message;
    }
}
exports.FormularioTituloVazioException = FormularioTituloVazioException;
//# sourceMappingURL=formulario.exception.js.map