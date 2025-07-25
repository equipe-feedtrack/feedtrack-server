"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampoConteudoVazioInvalido = exports.ObservacaoException = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class ObservacaoException extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de domínio genérica') {
        super(message);
        this.name = 'ObservacaoException';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ObservacaoException = ObservacaoException;
class CampoConteudoVazioInvalido extends ObservacaoException {
    constructor(message = '⚠️ O campo de conteúdo não pode ficar vazio após selecionando o tipo.') {
        super(message);
        this.name = 'CampoConteudoVazioInvalido';
        this.message = message;
    }
}
exports.CampoConteudoVazioInvalido = CampoConteudoVazioInvalido;
//# sourceMappingURL=observacao.exception.js.map