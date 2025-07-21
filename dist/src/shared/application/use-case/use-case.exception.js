"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioInexistente = exports.UseCaseException = void 0;
class UseCaseException extends Error {
    constructor(message = '⚠️ Exceção de domínio genérica') {
        super(message);
        this.name = 'DomainException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.UseCaseException = UseCaseException;
class FormularioInexistente extends UseCaseException {
    constructor(message = '⚠️ O Formulário não existe. colocar o 404') {
        super(message);
        this.name = 'Formulário não existe';
        this.message = message;
    }
}
exports.FormularioInexistente = FormularioInexistente;
//# sourceMappingURL=use-case.exception.js.map