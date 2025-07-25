"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDEntityUUIDInvalid = exports.DomainException = void 0;
class DomainException extends Error {
    constructor(message = '⚠️ Exceção de domínio genérica') {
        super(message);
        this.name = 'DomainException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainException = DomainException;
class IDEntityUUIDInvalid extends DomainException {
    constructor(message = '⚠️ O ID da entidade é um UUID inválido.') {
        super(message);
        this.name = 'IDEntityUUIDInvalid';
        this.message = message;
    }
}
exports.IDEntityUUIDInvalid = IDEntityUUIDInvalid;
//# sourceMappingURL=domain.exception.js.map