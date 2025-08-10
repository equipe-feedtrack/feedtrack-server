"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackExceptions = void 0;
// Exceções para Feedback (crie um arquivo feedback.exception.ts se necessário)
var FeedbackExceptions;
(function (FeedbackExceptions) {
    class RespostaInvalida extends Error {
        constructor(message) { super(message); this.name = "RespostaInvalida"; }
    }
    FeedbackExceptions.RespostaInvalida = RespostaInvalida;
    class FeedbackJaRegistrado extends Error {
        constructor(envioId) {
            super(`Já existe um feedback registrado para o envio ${envioId}.`);
            this.name = 'FeedbackJaRegistrado';
        }
    }
    FeedbackExceptions.FeedbackJaRegistrado = FeedbackJaRegistrado;
    class FormularioAssociadoInvalido extends Error {
        constructor(formularioId) {
            super(`Formulário associado (${formularioId}) inválido ou não encontrado.`);
            this.name = 'FormularioAssociadoInvalido';
        }
    }
    FeedbackExceptions.FormularioAssociadoInvalido = FormularioAssociadoInvalido;
    class EnvioNaoEncontrado extends Error {
        constructor(envioId) {
            super(`Envio com ID ${envioId} não encontrado.`);
            this.name = 'EnvioNaoEncontrado';
        }
    }
    FeedbackExceptions.EnvioNaoEncontrado = EnvioNaoEncontrado;
    // Remova as exceções específicas de texto, nota, opcaoEscolhida, pois a validação é mais genérica agora
    // RespostaTextualObrigatoria, NotaInvalida, OpcaoMultiplaEscolhaObrigatoria, RespostaInvalidaParaTipoPergunta
})(FeedbackExceptions || (exports.FeedbackExceptions = FeedbackExceptions = {}));
//# sourceMappingURL=feedback.exceptions.js.map