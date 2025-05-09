"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidacaoPerguntaException = exports.ErroPersistenciaException = exports.OpcaoDuplicadaException = exports.QuantidadeMinimaOpcoesException = exports.OpcoesObrigatoriasException = exports.TipoPerguntaInvalidoException = exports.PerguntaDuplicadaException = exports.PerguntaTextoVazioException = exports.PerguntaNaoEncontradaException = exports.PerguntaException = void 0;
const domain_exception_1 = require("@shared/domain/domain.exception");
class PerguntaException extends domain_exception_1.DomainException {
    constructor(message = '⚠️ Exceção de Domínio Genérica da Entidade Pergunta') {
        super(message);
        this.name = 'PerguntaException';
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.PerguntaException = PerguntaException;
class PerguntaNaoEncontradaException extends PerguntaException {
    constructor(perguntaId) {
        super(`Pergunta com ID ${perguntaId} não foi encontrada.`);
        this.perguntaId = perguntaId;
        this.name = 'PerguntaNaoEncontradaException';
    }
}
exports.PerguntaNaoEncontradaException = PerguntaNaoEncontradaException;
class PerguntaTextoVazioException extends PerguntaException {
    constructor(message = '⚠️ O texto da pergunta é obrigatório.') {
        super(message);
        this.name = 'PerguntaTextoVazioException ';
        this.message = message;
    }
}
exports.PerguntaTextoVazioException = PerguntaTextoVazioException;
class PerguntaDuplicadaException extends PerguntaException {
    constructor(message = '⚠️ Já possui pergunta com esse texto') {
        super(message);
        this.name = 'PerguntaDuplicadaException ';
        this.message = message;
    }
}
exports.PerguntaDuplicadaException = PerguntaDuplicadaException;
class TipoPerguntaInvalidoException extends PerguntaException {
    constructor(message = `⚠️ O tipo de pergunta deve ser 'nota', 'texto' ou 'multipla_escolha'.`) {
        super(message);
        this.message = message;
        this.name = "TipoPerguntaInvalidoException";
        this.message = message;
    }
}
exports.TipoPerguntaInvalidoException = TipoPerguntaInvalidoException;
class OpcoesObrigatoriasException extends PerguntaException {
    constructor() {
        super("Pelo menos uma opção é obrigatória para perguntas de múltipla escolha.");
        this.name = "OpcoesObrigatoriasException";
    }
}
exports.OpcoesObrigatoriasException = OpcoesObrigatoriasException;
class QuantidadeMinimaOpcoesException extends PerguntaException {
    constructor(quantidadeMinima) {
        super(`A pergunta exige pelo menos ${quantidadeMinima} opções.`);
        this.quantidadeMinima = quantidadeMinima;
        this.name = "QuantidadeMinimaOpcoesException";
    }
}
exports.QuantidadeMinimaOpcoesException = QuantidadeMinimaOpcoesException;
class OpcaoDuplicadaException extends PerguntaException {
    constructor(opcao) {
        super(`A opção "${opcao}" está duplicada.`);
        this.opcao = opcao;
        this.name = "OpcaoDuplicadaException";
    }
}
exports.OpcaoDuplicadaException = OpcaoDuplicadaException;
class ErroPersistenciaException extends PerguntaException {
    constructor(acao, erroOriginal) {
        super(`Erro ao tentar ${acao} a pergunta: ${erroOriginal.message}`);
        this.acao = acao;
        this.erroOriginal = erroOriginal;
        this.name = 'ErroPersistenciaException';
    }
}
exports.ErroPersistenciaException = ErroPersistenciaException;
class ValidacaoPerguntaException extends PerguntaException {
    constructor(mensagens) {
        super(`Erro de validação da pergunta: ${mensagens.join("; ")}`);
        this.mensagens = mensagens;
        this.name = 'ValidacaoPerguntaException';
    }
}
exports.ValidacaoPerguntaException = ValidacaoPerguntaException;
//# sourceMappingURL=pergunta.exception.js.map