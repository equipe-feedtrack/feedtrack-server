"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioInvalidoUsuario = exports.EnvioInvalidoCampanha = exports.EnvioInvalidoFormulario = exports.EnvioInvalidoCliente = exports.EnvioInvalidoFeedback = exports.EnvioExceptions = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class EnvioExceptions extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de Domínio Genérica da Entidade Formulario') {
        super(message);
        this.name = 'FormularioException';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.EnvioExceptions = EnvioExceptions;
class EnvioInvalidoFeedback extends EnvioExceptions {
    constructor(message = '⚠️ "ID do feedback é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.EnvioInvalidoFeedback = EnvioInvalidoFeedback;
class EnvioInvalidoCliente extends EnvioExceptions {
    constructor(message = '⚠️ "ID do cliente é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.EnvioInvalidoCliente = EnvioInvalidoCliente;
class EnvioInvalidoFormulario extends EnvioExceptions {
    constructor(message = '⚠️ "ID do formulário é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.EnvioInvalidoFormulario = EnvioInvalidoFormulario;
class EnvioInvalidoCampanha extends EnvioExceptions {
    constructor(message = '⚠️ "ID da campanha é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.EnvioInvalidoCampanha = EnvioInvalidoCampanha;
class EnvioInvalidoUsuario extends EnvioExceptions {
    constructor(message = '⚠️ "ID do usuário é obrigatório para associar."') {
        super(message);
        this.name = 'EnvioInvalido';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.EnvioInvalidoUsuario = EnvioInvalidoUsuario;
//# sourceMappingURL=envio.exceptios.js.map