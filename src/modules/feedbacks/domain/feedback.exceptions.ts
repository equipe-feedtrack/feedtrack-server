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
  // Remova as exceções específicas de texto, nota, opcaoEscolhida, pois a validação é mais genérica agora
  // RespostaTextualObrigatoria, NotaInvalida, OpcaoMultiplaEscolhaObrigatoria, RespostaInvalidaParaTipoPergunta
}