import { DomainException } from "@shared/domain/domain.exception";

class UsuarioException extends DomainException {
    constructor(message:string = '⚠️ Exceção de domínio usuário genérica') {
        super(message);
        this.name = 'UsuarioException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor)
    }
}

class UsuarioCadastradoException extends UsuarioException {
    public constructor(message:string = '⚠️ O usuário já se encontra cadastrado!.') {
        super(message);
        this.name = 'UsuarioCadastradoException'
        this.message = message;
    }
}

export {UsuarioException, UsuarioCadastradoException }