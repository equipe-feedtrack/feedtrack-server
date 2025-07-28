// src/modules/formulario/domain/feedback/feedback.entity.ts

import { Entity } from "@shared/domain/entity";
import { randomUUID } from "crypto";
import { TipoPergunta } from "@shared/domain/data.types"; // TipoPergunta ainda é usado dentro do JSON
import { IFeedback, CriarFeedbackProps, RecuperarFeedbackProps } from "./feedback.types"; // Use os tipos corrigidos
import { FeedbackExceptions } from "./feedback.exceptions";

class Feedback extends Entity<IFeedback> implements IFeedback {
  private _formularioId: string;
  private _resposta: Record<string, any>; // <-- ÚNICA PROPRIEDADE PARA RESPOSTAS
  private _dataCriacao: Date; // Alinhado com IFeedback e schema.prisma
  private _dataExclusao: Date | null; // Alinhado com IFeedback e schema.prisma

  // Getters
  get formularioId(): string { return this._formularioId; }
  get resposta(): Record<string, any> { return this._resposta; }
  get dataCriacao(): Date { return this._dataCriacao; }
  get dataExclusao(): Date | null { return this._dataExclusao; }

  // Setters privados (com validações básicas)
  private set formularioId(value: string) {
    if (!value || value.trim() === '') { throw new Error("ID do formulário é obrigatório para o feedback."); }
    this._formularioId = value;
  }
  private set resposta(value: Record<string, any>) {
    // Validação básica do objeto JSON de resposta.
    // Validações mais específicas (tipo da pergunta, etc.) serão feitas no validarInvariantes().
    if (!value || Object.keys(value).length === 0) {
      throw new FeedbackExceptions.RespostaInvalida("Respostas do feedback não podem ser vazias.");
    }
    this._resposta = value;
  }
  private set dataCriacao(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) { throw new Error("Data de criação inválida."); }
    this._dataCriacao = value;
  }
  private set dataExclusao(value: Date | null) { this._dataExclusao = value; }

  // Construtor privado
  private constructor(props: IFeedback) {
    super(props.id);
    this.formularioId = props.formularioId;
    this.resposta = props.resposta;
    this.dataCriacao = props.dataCriacao;
    this.dataExclusao = props.dataExclusao ?? null;

    this.validarInvariantes(); // Valida as regras de negócio intrínsecas
  }

  // Validações mais complexas baseadas no conteúdo do JSON 'resposta'
  private validarInvariantes(): void {
    // Para validar o conteúdo do JSON 'resposta', você precisaria
    // saber o 'tipo' da pergunta. Esse 'tipo' deve estar DENTRO do JSON 'resposta'.
    // Ex: this.resposta.tipoDePergunta (se o JSON contiver essa chave)
    
    // Supondo que a estrutura do JSON 'resposta' para uma Pergunta é:
    // { perguntaId: "uuid", tipo: "TEXTO", resposta_texto: "abc", nota: null, opcaoEscolhida: null }

    const { perguntaId, tipo, resposta_texto, nota, opcaoEscolhida, data_resposta } = this.resposta;

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
        if (nota !== null || opcaoEscolhida !== null) { // Nao deve ter outros tipos de resposta
            throw new FeedbackExceptions.RespostaInvalida("Resposta tipo TEXTO não deve conter nota ou opção.");
        }
        break;
      case TipoPergunta.NOTA:
        if (typeof nota !== 'number' || nota < 0 || nota > 10) {
          throw new FeedbackExceptions.RespostaInvalida("Nota inválida para tipo NOTA (deve ser número entre 0 e 10).");
        }
        if (resposta_texto !== null || opcaoEscolhida !== null) {
            throw new FeedbackExceptions.RespostaInvalida("Resposta tipo NOTA não deve conter texto ou opção.");
        }
        break;
      case TipoPergunta.MULTIPLA_ESCOLHA:
        if (!opcaoEscolhida || typeof opcaoEscolhida !== 'string' || opcaoEscolhida.trim() === "") {
          throw new FeedbackExceptions.RespostaInvalida("Opção escolhida obrigatória para tipo MULTIPLA_ESCOLHA.");
        }
        if (resposta_texto !== null || nota !== null) {
            throw new FeedbackExceptions.RespostaInvalida("Resposta tipo MULTIPLA_ESCOLHA não deve conter texto ou nota.");
        }
        break;
      default:
        throw new FeedbackExceptions.RespostaInvalida("Tipo de pergunta desconhecido ou inválido na resposta.");
    }
  }

  // Método de Fábrica
  public static criar(props: CriarFeedbackProps, id?: string): Feedback {
    // Antes de construir o objeto IFeedback completo, precisamos validar o JSON de resposta
    // Faça as validações do JSON aqui, similar ao validarInvariantes()
    const { perguntaId, tipo, resposta_texto, nota, opcaoEscolhida } = props.resposta; // Acesse as props do JSON
    
    // Validações de criação (que antes estavam no switch)
    if (!perguntaId || typeof perguntaId !== 'string') {
        throw new FeedbackExceptions.RespostaInvalida("ID da pergunta é obrigatório na resposta.");
    }
    if (!tipo || !Object.values(TipoPergunta).includes(tipo as TipoPergunta)) {
        throw new FeedbackExceptions.RespostaInvalida("Tipo de pergunta é obrigatório e válido na resposta.");
    }

    switch (tipo as TipoPergunta) {
      case TipoPergunta.TEXTO:
        if (!resposta_texto || typeof resposta_texto !== 'string' || resposta_texto.trim() === "") {
          throw new FeedbackExceptions.RespostaInvalida("Resposta textual obrigatória para tipo TEXTO.");
        }
        break;
      case TipoPergunta.NOTA:
        if (typeof nota !== 'number' || nota < 0 || nota > 10) {
          throw new FeedbackExceptions.RespostaInvalida("Nota inválida para tipo NOTA (deve ser número entre 0 e 10).");
        }
        break;
      case TipoPergunta.MULTIPLA_ESCOLHA:
        if (!opcaoEscolhida || typeof opcaoEscolhida !== 'string' || opcaoEscolhida.trim() === "") {
          throw new FeedbackExceptions.RespostaInvalida("Opção escolhida obrigatória para tipo MULTIPLA_ESCOLHA.");
        }
        break;
      default:
        throw new FeedbackExceptions.RespostaInvalida("Tipo de pergunta desconhecido ou inválido na resposta.");
    }

    const feedbackCompleto: IFeedback = {
      id: id || randomUUID(),
      formularioId: props.formularioId,
      resposta: props.resposta, // O objeto JSON de resposta é passado diretamente
      dataCriacao: new Date(),
      dataExclusao: null,
    };
    return new Feedback(feedbackCompleto);
  }

  public static recuperar(props: RecuperarFeedbackProps): Feedback {
    // Ao recuperar, a validação de invariantes ocorrerá no construtor.
    if (!props.id) { throw new Error("ID é obrigatório para recuperar Feedback."); }
    return new Feedback(props);
  }

  // Comportamento: Marcar como excluído (exclusão lógica)
  public excluirLogicamente(): void {
    if (this.dataExclusao !== null) { throw new Error("Feedback já está excluído."); }
    this.dataExclusao = new Date();
  }
}

export { Feedback };