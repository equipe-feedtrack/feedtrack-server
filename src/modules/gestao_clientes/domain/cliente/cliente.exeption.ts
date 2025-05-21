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

class QtdMinimaProdutosClienteInvalida extends ClienteException {
    public constructor(message:string = '⚠️ A quantidade mínima de produtos é inválida.') {
        super(message);
        this.name = 'QtdMinimaProdutosClienteInvalida'
        this.message = message;
    }
}

const ClienteExceptions = {
  ClienteException,
  NomeClienteTamanhoMinimoInvalido,
  NomeClienteTamanhoMaximoInvalido,
  EmailClienteInvalido,
  TelefoneClienteInvalido,
  QtdMinimaProdutosClienteInvalida
};

export {
  ClienteExceptions,
};
