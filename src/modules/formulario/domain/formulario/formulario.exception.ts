import { DomainException } from "@shared/domain/domain.exception";

class FormularioException extends DomainException {
    constructor(message:string = '⚠️ Exceção de Domínio Genérica da Entidade Formulario') {
        super(message);
        this.name = 'FormularioException'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class FormularioTituloVazioException  extends FormularioException {
    public constructor(message:string = '⚠️ O título do formulário é obrigatório.') {
        super(message);
        this.name = 'FormularioTituloVazioException ';
        this.message = message;
    }
}

export {
    FormularioException,
    FormularioTituloVazioException,
}