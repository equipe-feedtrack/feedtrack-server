class UseCaseException extends Error {
    constructor(message:string = '⚠️ Exceção de domínio genérica') {
        super(message);
        this.name = 'DomainException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor)
    }
}
class FormularioInexistente extends UseCaseException {
    public constructor(message:string = '⚠️ O Formulário não existe. colocar o 404') {
        super(message);
        this.name = 'Formulário não existe';
        this.message = message;
    }
}

export{
    UseCaseException,
    FormularioInexistente
}