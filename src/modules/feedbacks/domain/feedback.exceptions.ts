// Exceções para Feedback (crie um arquivo feedback.exception.ts se necessário)
export namespace FeedbackExceptions {
  export class RespostaInvalida extends Error { // Exceção genérica para validação de resposta JSON
    constructor(message: string) { super(message); this.name = "RespostaInvalida"; }
  }

  export class FeedbackJaRegistrado extends Error {
    constructor(envioId: string) {
      super(`Já existe um feedback registrado para o envio ${envioId}.`);
      this.name = 'FeedbackJaRegistrado';
    }
  }

  export class FormularioAssociadoInvalido extends Error {
    constructor(formularioId: string) {
      super(`Formulário associado (${formularioId}) inválido ou não encontrado.`);
      this.name = 'FormularioAssociadoInvalido';
    }
  }

  export class EnvioNaoEncontrado extends Error {
    constructor(envioId: string) {
      super(`Envio com ID ${envioId} não encontrado.`);
      this.name = 'EnvioNaoEncontrado';
    }
  }

  export class ClienteNomeObrigatorio extends Error {
    constructor() {
      super('O nome do cliente é obrigatório.');
      this.name = 'ClienteNomeObrigatorio';
    }
  }

  export class ProdutoNomeObrigatorio extends Error {
    constructor() {
      super('O nome do produto é obrigatório.');
      this.name = 'ProdutoNomeObrigatorio';
    }
  }

  export class VendaIdObrigatorio extends Error {
    constructor() {
      super('O ID da venda é obrigatório.');
      this.name = 'VendaIdObrigatorio';
    }
  }

  export class EmpresaIdObrigatorio extends Error {
    constructor() {
      super('O ID da empresa é obrigatório.');
      this.name = 'EmpresaIdObrigatorio';
    }
  }
  // Remova as exceções específicas de texto, nota, opcaoEscolhida, pois a validação é mais genérica agora
  // RespostaTextualObrigatoria, NotaInvalida, OpcaoMultiplaEscolhaObrigatoria, RespostaInvalidaParaTipoPergunta
}