"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioCadastradoException = exports.UsuarioException = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class UsuarioException extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de domínio usuário genérica') {
        super(message);
        this.name = 'UsuarioException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.UsuarioException = UsuarioException;
class UsuarioCadastradoException extends UsuarioException {
    constructor(message = '⚠️ O usuário já se encontra cadastrado!.') {
        super(message);
        this.name = 'UsuarioCadastradoException';
        this.message = message;
    }
}
exports.UsuarioCadastradoException = UsuarioCadastradoException;
//# sourceMappingURL=usuario.exception.js.map