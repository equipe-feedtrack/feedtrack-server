import { DomainException } from "@shared/domain/domain.exception";

class ObservacaoException extends DomainException {
    constructor(message:string = '⚠️ Exceção de domínio genérica') {
        super(message);
        this.name = 'ObservacaoException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor)
    }
}

class CampoConteudoVazioInvalido extends ObservacaoException {
    public constructor(message:string = '⚠️ O campo de conteúdo não pode ficar vazio após selecionando o tipo.') {
        super(message);
        this.name = 'CampoConteudoVazioInvalido'
        this.message = message;
    }
}

export {ObservacaoException, CampoConteudoVazioInvalido}