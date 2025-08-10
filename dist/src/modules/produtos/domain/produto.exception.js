"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoExceptions = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class ProdutoException extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de Domínio Genérica da Entidade Produto') {
        super(message);
        this.name = 'ProdutoException';
        this.message = message;
    }
}
class NomeProdutoTamanhoMinimoInvalido extends ProdutoException {
    constructor(message = '⚠️ O nome do produto não possui um tamanho mínimo válido.') {
        super(message);
        this.name = 'NomeProdutoTamanhoMinimoInvalido';
        this.message = message;
    }
}
class NomeProdutoTamanhoMaximoInvalido extends ProdutoException {
    constructor(message = '⚠️ O nome do produto não possui um tamanho máximo válido.') {
        super(message);
        this.name = 'NomeProdutoTamanhoMaximoInvalido';
        this.message = message;
    }
}
class DescricaoProdutoTamanhoMinimoInvalido extends ProdutoException {
    constructor(message = '⚠️ A descrição do produto não possui um tamanho mínimo válido.') {
        super(message);
        this.name = 'DescricaoProdutoTamanhoMinimoInvalido';
        this.message = message;
    }
}
class DescricaoProdutoTamanhoMaximoInvalido extends ProdutoException {
    constructor(message = '⚠️ A descrição do produto não possui um tamanho máximo válido.') {
        super(message);
        this.name = 'DescricaoProdutoTamanhoMaximoInvalido';
        this.message = message;
    }
}
class ValorMinimoProdutoInvalido extends ProdutoException {
    constructor(message = '⚠️ O valor mínimo do produto é inválido.') {
        super(message);
        this.name = 'ValorMinimoProdutoInvalido';
        this.message = message;
    }
}
const ProdutoExceptions = {
    ProdutoException: ProdutoException,
    NomeProdutoTamanhoMinimoInvalido: NomeProdutoTamanhoMinimoInvalido,
    NomeProdutoTamanhoMaximoInvalido: NomeProdutoTamanhoMaximoInvalido,
    DescricaoProdutoTamanhoMinimoInvalido: DescricaoProdutoTamanhoMinimoInvalido,
    DescricaoProdutoTamanhoMaximoInvalido: DescricaoProdutoTamanhoMaximoInvalido,
    ValorMinimoProdutoInvalido: ValorMinimoProdutoInvalido,
};
exports.ProdutoExceptions = ProdutoExceptions;
//# sourceMappingURL=produto.exception.js.map