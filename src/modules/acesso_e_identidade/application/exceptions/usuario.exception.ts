import { ApplicationException } from '@shared/application/application.exception';

export class UsuarioNaoEncontradoException extends ApplicationException {
  constructor() {
    super('Usuário não encontrado');
    this.name = 'UsuarioNaoEncontradoException';
  }
}

export class SenhaInvalidaException extends Error {
  constructor() {
    super('Senha inválida');
    this.name = 'SenhaInvalidaException';
  }
}
