
import { TipoPergunta } from "@shared/domain/data.types";
import { FeedbackExceptions } from "./feedback.exceptions";
import { CriarFeedbackProps, IFeedback, RecuperarFeedbackProps, CriarFeedbackManualProps } from "./feedback.types";
import { Entity } from "@shared/domain/entity";
import { randomUUID } from "crypto";

class Feedback extends Entity<IFeedback> implements IFeedback {
  private _formularioId: string | null;
  private _envioId: string | null;
  private _respostas: Record<string, any>[];
  private _dataCriacao: Date;
  private _dataExclusao: Date | null;
  private _clienteNome: string | null;
  private _produtoNome: string | null;
  private _funcionarioNome: string | null;

  // Getters
  get formularioId(): string | null { return this._formularioId; }
  get envioId(): string | null { return this._envioId; }
  get respostas(): Record<string, any>[] { return this._respostas; }
  get dataCriacao(): Date { return this._dataCriacao; }
  get dataExclusao(): Date | null { return this._dataExclusao; }
  get clienteNome(): string | null { return this._clienteNome; }
  get produtoNome(): string | null { return this._produtoNome; }
  get funcionarioNome(): string | null { return this._funcionarioNome; }

  // Setters privados
  private set formularioId(value: string | null) {
    this._formularioId = value;
  }
  private set envioId(value: string | null) {
    this._envioId = value;
  }
  private set respostas(value: Record<string, any>[]) {
    if (!value || value.length === 0) {
      throw new FeedbackExceptions.RespostaInvalida("Respostas do feedback não podem ser vazias.");
    }
    this._respostas = value;
  }
  private set dataCriacao(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("Data de criação inválida.");
    }
    this._dataCriacao = value;
  }
  private set dataExclusao(value: Date | null) { this._dataExclusao = value; }
  private set clienteNome(value: string | null) { this._clienteNome = value; }
  private set produtoNome(value: string | null) { this._produtoNome = value; }
  private set funcionarioNome(value: string | null) { this._funcionarioNome = value; }

  // Construtor privado
  private constructor(props: IFeedback) {
    super(props.id);
    this.formularioId = props.formularioId;
    this.envioId = props.envioId ?? null; // Adicionado para consistência
    this._respostas = props.respostas;
    this.dataCriacao = props.dataCriacao;
    this.dataExclusao = props.dataExclusao ?? null;
    this.clienteNome = props.clienteNome ?? null;
    this.produtoNome = props.produtoNome ?? null;
    this.funcionarioNome = props.funcionarioNome ?? null;

    if (this.formularioId && this.envioId) {
        this.validarInvariantes();
    }
  }

  private validarInvariantes(): void {
    // A validação agora itera sobre cada resposta no array
    this._respostas.forEach(resposta => {
      const { perguntaId, tipo, resposta_texto, nota, opcaoEscolhida, data_resposta } = resposta;

      if (!perguntaId || typeof perguntaId !== 'string') {
        throw new FeedbackExceptions.RespostaInvalida("ID da pergunta é obrigatório na resposta.");
      }
      if (!tipo || !Object.values(TipoPergunta).includes(tipo as TipoPergunta)) {
        throw new FeedbackExceptions.RespostaInvalida("Tipo de pergunta é obrigatório e válido na resposta.");
      }
      if (!(data_resposta instanceof Date) || isNaN(data_resposta.getTime())) {
        throw new FeedbackExceptions.RespostaInvalida("Data da resposta inválida ou ausente.");
      }

      switch (tipo as TipoPergunta) {
        case TipoPergunta.TEXTO:
          if (!resposta_texto || typeof resposta_texto !== 'string' || resposta_texto.trim() === "") {
            throw new FeedbackExceptions.RespostaInvalida("Resposta textual obrigatória para tipo TEXTO.");
          }
          if (nota !== undefined || opcaoEscolhida !== undefined) {
            throw new FeedbackExceptions.RespostaInvalida("Resposta tipo TEXTO não deve conter nota ou opção.");
          }
          break;
        case TipoPergunta.NOTA:
          if (typeof nota !== 'number' || nota < 0 || nota > 10) {
            throw new FeedbackExceptions.RespostaInvalida("Nota inválida para tipo NOTA (deve ser número entre 0 e 10).");
          }
          if (resposta_texto !== undefined || opcaoEscolhida !== undefined) {
            throw new FeedbackExceptions.RespostaInvalida("Resposta tipo NOTA não deve conter texto ou opção.");
          }
          break;
        case TipoPergunta.MULTIPLA_ESCOLHA:
          if (!opcaoEscolhida || typeof opcaoEscolhida !== 'string' || opcaoEscolhida.trim() === "") {
            throw new FeedbackExceptions.RespostaInvalida("Opção escolhida obrigatória para tipo MULTIPLA_ESCOLHA.");
          }
          if (resposta_texto !== undefined || nota !== undefined) {
            throw new FeedbackExceptions.RespostaInvalida("Resposta tipo MULTIPLA_ESCOLHA não deve conter texto ou nota.");
          }
          break;
        default:
          throw new FeedbackExceptions.RespostaInvalida("Tipo de pergunta desconhecido ou inválido na resposta.");
      }
    });
  }

  public static criar(props: CriarFeedbackProps, id?: string): Feedback {
    if (!props.envioId || typeof props.envioId !== 'string') {
      throw new Error("ID do envio é obrigatório para criar um feedback.");
    }
    if (!props.formularioId || typeof props.formularioId !== 'string') {
      throw new Error("ID do formulário é obrigatório para criar um feedback.");
    }
    if (!props.respostas || props.respostas.length === 0) {
      throw new FeedbackExceptions.RespostaInvalida("Respostas do feedback não podem ser vazias.");
    }

    // Mapeia e limpa cada resposta antes de criar a entidade
    const respostasValidadas = props.respostas.map(respostas => {
      const { perguntaId, tipo, resposta_texto, nota, opcaoEscolhida } = respostas;

      if (!perguntaId || typeof perguntaId !== 'string') {
        throw new FeedbackExceptions.RespostaInvalida("ID da pergunta é obrigatório na resposta.");
      }
      if (!tipo || !Object.values(TipoPergunta).includes(tipo as TipoPergunta)) {
        throw new FeedbackExceptions.RespostaInvalida("Tipo de pergunta é obrigatório e válido na resposta.");
      }

      const respostaLimpa: Record<string, any> = {
        perguntaId,
        tipo,
        data_resposta: new Date(),
      };

      switch (tipo as TipoPergunta) {
        case TipoPergunta.TEXTO:
          if (!resposta_texto || typeof resposta_texto !== 'string' || resposta_texto.trim() === "") {
            throw new FeedbackExceptions.RespostaInvalida("Resposta textual obrigatória para tipo TEXTO.");
          }
          respostaLimpa.resposta_texto = resposta_texto;
          break;
        case TipoPergunta.NOTA:
          if (typeof nota !== 'number' || nota < 0 || nota > 10) {
            throw new FeedbackExceptions.RespostaInvalida("Nota inválida para tipo NOTA (deve ser número entre 0 e 10).");
          }
          respostaLimpa.nota = nota;
          break;
        case TipoPergunta.MULTIPLA_ESCOLHA:
          if (!opcaoEscolhida || typeof opcaoEscolhida !== 'string' || opcaoEscolhida.trim() === "") {
            throw new FeedbackExceptions.RespostaInvalida("Opção escolhida obrigatória para tipo MULTIPLA_ESCOLHA.");
          }
          respostaLimpa.opcaoEscolhida = opcaoEscolhida;
          break;
        default:
          throw new FeedbackExceptions.RespostaInvalida("Tipo de pergunta desconhecido ou inválido na resposta.");
      }
      return respostaLimpa;
    });

    const feedbackCompleto: IFeedback = {
      id: id || randomUUID(),
      formularioId: props.formularioId || null,
      envioId: props.envioId,
      respostas: respostasValidadas,
      dataCriacao: new Date(),
      dataExclusao: null,
    };
    return new Feedback(feedbackCompleto);
  }

  public static criarManual(props: CriarFeedbackManualProps, id?: string): Feedback {
    const feedbackCompleto: IFeedback = {
      id: id || randomUUID(),
      formularioId: null,
      envioId: null,
      respostas: props.respostas,
      dataCriacao: new Date(),
      dataExclusao: null,
      clienteNome: props.clienteNome,
      produtoNome: props.produtoNome,
      funcionarioNome: props.funcionarioNome,
    };
    return new Feedback(feedbackCompleto);
  }

  public static recuperar(props: RecuperarFeedbackProps): Feedback {
    if (!props.id) { throw new Error("ID é obrigatório para recuperar Feedback."); }
    if (!props.respostas || props.respostas.length === 0) {
      throw new FeedbackExceptions.RespostaInvalida("Respostas do feedback não podem ser vazias.");
    }
    return new Feedback(props);
  }

  public excluirLogicamente(): void {
    if (this.dataExclusao !== null) { throw new Error("Feedback já está excluído."); }
    this.dataExclusao = new Date();
  }
}

export { Feedback }


  