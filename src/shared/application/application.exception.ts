class ApplicationException extends Error {
    constructor(message:string = '⚠️ Exceção de aplicação genérica') {
        super(message);
        this.name = 'ApplicationException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor)
    }
}

class FormularioNaoEncontrado extends ApplicationException {
    public constructor(message:string = '⚠️ O ID da entidade formulário não foi encontrado.') {
        super(message);
        this.name = 'FormularioNaoEncontrado'
        this.message = message;
    }
}

export {
    ApplicationException,
    FormularioNaoEncontrado
}