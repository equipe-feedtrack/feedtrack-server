import { DomainException } from "@shared/domain/domain.exception";

class EnvioExceptions extends DomainException {
    constructor(message:string = '⚠️ Exceção de Domínio Genérica da Entidade Formulario') {
        super(message);
        this.name = 'FormularioException'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class EnvioInvalidoFeedback extends EnvioExceptions {
    constructor(message:string = '⚠️ "ID do feedback é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class EnvioInvalidoCliente extends EnvioExceptions {
    constructor(message:string = '⚠️ "ID do cliente é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class EnvioInvalidoFormulario extends EnvioExceptions {
    constructor(message:string = '⚠️ "ID do formulário é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class EnvioInvalidoCampanha extends EnvioExceptions {
    constructor(message:string = '⚠️ "ID da campanha é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class EnvioInvalidoUsuario extends EnvioExceptions {
    constructor(message:string = '⚠️ "ID do usuário é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class EnvioInvalidoProduto extends EnvioExceptions {
    constructor(message:string = '⚠️ "ID do produto é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export {
    EnvioExceptions,
    EnvioInvalidoFeedback,
    EnvioInvalidoCliente,
    EnvioInvalidoFormulario,
    EnvioInvalidoCampanha,
    EnvioInvalidoUsuario,
    EnvioInvalidoProduto
}