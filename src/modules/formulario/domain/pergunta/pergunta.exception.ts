import { DomainException } from "@shared/domain/domain.exception";

class PerguntaException extends DomainException {
    constructor(message:string = '⚠️ Exceção de Domínio Genérica da Entidade Pergunta') {
        super(message);
        this.name = 'PerguntaException'
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class PerguntaNaoEncontradaException extends PerguntaException {
    public constructor(public perguntaId: string) {
        super(`Pergunta com ID ${perguntaId} não foi encontrada.`);
        this.name = 'PerguntaNaoEncontradaException';
    }
}

class PerguntaTextoVazioException  extends PerguntaException {
    public constructor(message:string = '⚠️ O texto da pergunta é obrigatório.') {
        super(message);
        this.name = 'PerguntaTextoVazioException ';
        this.message = message;
    }
}

class PerguntaDuplicadaException  extends PerguntaException {
    public constructor(message:string = '⚠️ Já possui pergunta com esse texto') {
        super(message);
        this.name = 'PerguntaDuplicadaException ';
        this.message = message;
    }
}

class TipoPerguntaInvalidoException extends PerguntaException {
    constructor(public message: string = `⚠️ O tipo de pergunta deve ser 'nota', 'texto' ou 'multipla_escolha'.` ) {
      super(message);
      this.name = "TipoPerguntaInvalidoException";
      this.message = message;
    }
  }

  class OpcoesObrigatoriasException extends PerguntaException {
    constructor() {
      super("Pelo menos uma opção é obrigatória para perguntas de múltipla escolha.");
      this.name = "OpcoesObrigatoriasException";
    }
  }

  class QuantidadeMinimaOpcoesException extends PerguntaException {
    constructor(public quantidadeMinima: number) {
      super(`A pergunta exige pelo menos ${quantidadeMinima} opções.`);
      this.name = "QuantidadeMinimaOpcoesException";
    }
  }

  class OpcaoDuplicadaException extends PerguntaException {
    constructor(public opcao: string) {
      super(`A opção "${opcao}" está duplicada.`);
      this.name = "OpcaoDuplicadaException";
    }
  }

class ErroPersistenciaException extends PerguntaException {
    public constructor(public acao: string, public erroOriginal: Error) {
        super(`Erro ao tentar ${acao} a pergunta: ${erroOriginal.message}`);
        this.name = 'ErroPersistenciaException';
    }
}

class ValidacaoPerguntaException  extends PerguntaException {
    public constructor(public mensagens: string[]) {
        super(`Erro de validação da pergunta: ${mensagens.join("; ")}`);
        this.name = 'ValidacaoPerguntaException';
    }
}

export {
    PerguntaException,
    PerguntaNaoEncontradaException,
    PerguntaTextoVazioException,
    PerguntaDuplicadaException,
    TipoPerguntaInvalidoException,
    OpcoesObrigatoriasException,
    QuantidadeMinimaOpcoesException,
    OpcaoDuplicadaException,
    ErroPersistenciaException,
    ValidacaoPerguntaException
}