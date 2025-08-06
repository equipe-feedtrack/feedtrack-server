import { DomainException } from "@shared/domain/domain.exception";

class ClienteException extends DomainException {
  constructor(message: string = '⚠️ Exceção de Domínio Genérica da Entidade Cliente') {
    super(message);
    this.name = 'ClienteException';
    this.message = message;
  }
}

class NomeClienteTamanhoMinimoInvalido extends ClienteException {
  constructor(message: string = '⚠️ O nome do cliente não possui um tamanho mínimo válido.') {
    super(message);
    this.name = 'NomeClienteTamanhoMinimoInvalido';
    this.message = message;
  }
}

class NomeClienteTamanhoMaximoInvalido extends ClienteException {
  constructor(message: string = '⚠️ O nome do cliente não possui um tamanho máximo válido.') {
    super(message);
    this.name = 'NomeClienteTamanhoMaximoInvalido';
    this.message = message;
  }
}

class EmailClienteInvalido extends ClienteException {
  constructor(message: string = '⚠️ O email do cliente é inválido.') {
    super(message);
    this.name = 'EmailClienteInvalido';
    this.message = message;
  }
}

class TelefoneClienteInvalido extends ClienteException {
  constructor(message: string = '⚠️ O telefone do cliente é inválido.') {
    super(message);
    this.name = 'TelefoneClienteInvalido';
    this.message = message;
  }
}

class TelefoneObrigatorioParaClienteException extends ClienteException {
  constructor(message: string = '⚠️ O telefone do cliente é Obrigatório.') {
    super(message);
    this.name = 'TelefoneObrigatorioParaCliente';
    this.message = message;
  }
}

class QtdMinimaProdutosClienteInvalida extends ClienteException {
  constructor(message: string = '⚠️ A quantidade mínima de produtos é inválida.') {
    super(message);
    this.name = 'QtdMinimaProdutosClienteInvalida';
    this.message = message;
  }
}

class ClienteNaoEncontrado extends ClienteException {
  constructor(message: string = '⚠️ Cliente não encontrado.') {
    super(message);
    this.name = 'ClienteNaoEncontrado';
    this.message = message;
  }
}

class ClienteJaExistente extends ClienteException {
  constructor(message: string = '⚠️ Já existe um cliente com esses dados.') {
    super(message);
    this.name = 'ClienteJaExistente';
    this.message = message;
  }
}

class IdClienteInvalido extends ClienteException {
  constructor(message: string = '⚠️ O ID do cliente é inválido.') {
    super(message);
    this.name = 'IdClienteInvalido';
    this.message = message;
  }
}

class EnderecoClienteInvalido extends ClienteException {
  constructor(message: string = '⚠️ O endereço do cliente é inválido ou incompleto.') {
    super(message);
    this.name = 'EnderecoClienteInvalido';
    this.message = message;
  }
}

class ConsentimentoLGPDInvalido extends ClienteException {
  constructor(message: string = '⚠️ Consentimento LGPD do cliente inválido ou ausente.') {
    super(message);
    this.name = 'ConsentimentoLGPDInvalido';
    this.message = message;
  }
}

class DataCadastroInvalida extends ClienteException {
  constructor(message: string = '⚠️ Data de cadastro do cliente inválida.') {
    super(message);
    this.name = 'DataCadastroInvalida';
    this.message = message;
  }
}
 class ClienteJaInativo extends ClienteException {
    constructor(id: string) {
      super(`Cliente com ID ${id} já está inativo.`);
      this.name = 'ClienteJaInativo';
    }
  }

 class ClienteJaAtivo extends ClienteException {
    constructor(id: string) {
      super(`Cliente com ID ${id} já está ativo.`);
      this.name = 'ClienteJaAtivo';
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
  ClienteJaAtivo
};

export {
  ClienteExceptions
};
