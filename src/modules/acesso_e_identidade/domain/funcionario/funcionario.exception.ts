import { DomainException } from "@shared/domain/domain.exception";

class FuncionarioException extends DomainException {
    constructor(message:string = '⚠️ Exceção de domínio funcionário genérica') {
        super(message);
        this.name = 'FuncionarioException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor)
    }
}

class nomeFuncionarioInvalido extends FuncionarioException {
    public constructor(message:string = '⚠️ O nome do Funcionário é inválido.') {
        super(message);
        this.name = 'nomeFuncionarioInvalido'
        this.message = message;
    }
}

export {FuncionarioException, nomeFuncionarioInvalido}