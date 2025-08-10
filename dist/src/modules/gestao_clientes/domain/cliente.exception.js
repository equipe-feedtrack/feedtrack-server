"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteExceptions = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class ClienteException extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de Domínio Genérica da Entidade Cliente') {
        super(message);
        this.name = 'ClienteException';
        this.message = message;
    }
}
class NomeClienteTamanhoMinimoInvalido extends ClienteException {
    constructor(message = '⚠️ O nome do cliente não possui um tamanho mínimo válido.') {
        super(message);
        this.name = 'NomeClienteTamanhoMinimoInvalido';
        this.message = message;
    }
}
class NomeClienteTamanhoMaximoInvalido extends ClienteException {
    constructor(message = '⚠️ O nome do cliente não possui um tamanho máximo válido.') {
        super(message);
        this.name = 'NomeClienteTamanhoMaximoInvalido';
        this.message = message;
    }
}
class EmailClienteInvalido extends ClienteException {
    constructor(message = '⚠️ O email do cliente é inválido.') {
        super(message);
        this.name = 'EmailClienteInvalido';
        this.message = message;
    }
}
class TelefoneClienteInvalido extends ClienteException {
    constructor(message = '⚠️ O telefone do cliente é inválido.') {
        super(message);
        this.name = 'TelefoneClienteInvalido';
        this.message = message;
    }
}
class TelefoneObrigatorioParaClienteException extends ClienteException {
    constructor(message = '⚠️ O telefone do cliente é Obrigatório.') {
        super(message);
        this.name = 'TelefoneObrigatorioParaCliente';
        this.message = message;
    }
}
class QtdMinimaProdutosClienteInvalida extends ClienteException {
    constructor(message = '⚠️ A quantidade mínima de produtos é inválida.') {
        super(message);
        this.name = 'QtdMinimaProdutosClienteInvalida';
        this.message = message;
    }
}
class ClienteNaoEncontrado extends ClienteException {
    constructor(message = '⚠️ Cliente não encontrado.') {
        super(message);
        this.name = 'ClienteNaoEncontrado';
        this.message = message;
    }
}
class ClienteJaExistente extends ClienteException {
    constructor(message = '⚠️ Já existe um cliente com esses dados.') {
        super(message);
        this.name = 'ClienteJaExistente';
        this.message = message;
    }
}
class IdClienteInvalido extends ClienteException {
    constructor(message = '⚠️ O ID do cliente é inválido.') {
        super(message);
        this.name = 'IdClienteInvalido';
        this.message = message;
    }
}
class EnderecoClienteInvalido extends ClienteException {
    constructor(message = '⚠️ O endereço do cliente é inválido ou incompleto.') {
        super(message);
        this.name = 'EnderecoClienteInvalido';
        this.message = message;
    }
}
class ConsentimentoLGPDInvalido extends ClienteException {
    constructor(message = '⚠️ Consentimento LGPD do cliente inválido ou ausente.') {
        super(message);
        this.name = 'ConsentimentoLGPDInvalido';
        this.message = message;
    }
}
class DataCadastroInvalida extends ClienteException {
    constructor(message = '⚠️ Data de cadastro do cliente inválida.') {
        super(message);
        this.name = 'DataCadastroInvalida';
        this.message = message;
    }
}
class ClienteJaInativo extends ClienteException {
    constructor(id) {
        super(`Cliente com ID ${id} já está inativo.`);
        this.name = 'ClienteJaInativo';
    }
}
class ClienteJaAtivo extends ClienteException {
    constructor(id) {
        super(`Cliente com ID ${id} já está ativo.`);
        this.name = 'ClienteJaAtivo';
    }
}
class ClienteProdutoIdObrigatorio extends ClienteException {
    constructor(id) {
        super('ID do produto é obrigatório.');
        this.name = 'ClienteProdutoIdObrigatorio';
    }
}
class ClienteProdutoJaTem extends ClienteException {
    constructor(id) {
        super('O cliente já possui este produto.');
        this.name = 'ClienteProdutoObrigatorio';
    }
}
class ClienteNaoPossuiProduto extends ClienteException {
    constructor(id) {
        super('O cliente não possui este produto.');
        this.name = 'ClienteProdutoObrigatorio';
    }
}
class InvalidOperationError extends ClienteException {
    constructor(id) {
        super('Operação está dando erro.');
        this.name = 'InvalidOperationError';
    }
}
const ClienteExceptions = {
    ClienteException,
    NomeClienteTamanhoMinimoInvalido,
    NomeClienteTamanhoMaximoInvalido,
    EmailClienteInvalido,
    TelefoneClienteInvalido,
    TelefoneObrigatorioParaClienteException,
    QtdMinimaProdutosClienteInvalida,
    ClienteNaoEncontrado,
    ClienteJaExistente,
    IdClienteInvalido,
    EnderecoClienteInvalido,
    ConsentimentoLGPDInvalido,
    DataCadastroInvalida,
    ClienteJaInativo,
    ClienteJaAtivo,
    ClienteProdutoIdObrigatorio,
    ClienteProdutoJaTem,
    ClienteNaoPossuiProduto,
    InvalidOperationError
};
exports.ClienteExceptions = ClienteExceptions;
//# sourceMappingURL=cliente.exception.js.map