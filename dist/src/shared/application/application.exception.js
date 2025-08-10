"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormularioNaoEncontrado = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    constructor(message = '⚠️ Exceção de aplicação genérica') {
        super(message);
        this.name = 'ApplicationException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationException = ApplicationException;
class FormularioNaoEncontrado extends ApplicationException {
    constructor(message = '⚠️ O ID da entidade formulário não foi encontrado.') {
        super(message);
        this.name = 'FormularioNaoEncontrado';
        this.message = message;
    }
}
exports.FormularioNaoEncontrado = FormularioNaoEncontrado;
//# sourceMappingURL=application.exception.js.map