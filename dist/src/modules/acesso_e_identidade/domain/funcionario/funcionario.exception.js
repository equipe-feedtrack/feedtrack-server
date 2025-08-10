"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nomeFuncionarioInvalido = exports.FuncionarioException = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class FuncionarioException extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de domínio funcionário genérica') {
        super(message);
        this.name = 'FuncionarioException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.FuncionarioException = FuncionarioException;
class nomeFuncionarioInvalido extends FuncionarioException {
    constructor(message = '⚠️ O nome do Funcionário é inválido.') {
        super(message);
        this.name = 'nomeFuncionarioInvalido';
        this.message = message;
    }
}
exports.nomeFuncionarioInvalido = nomeFuncionarioInvalido;
//# sourceMappingURL=funcionario.exception.js.map