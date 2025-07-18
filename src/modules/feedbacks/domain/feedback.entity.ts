import { Entity } from "@shared/domain/entity";
import { FeedbackDTO, IFeedback, IFeedbackProps } from "./feedback.types";
import { TipoPergunta } from "@shared/domain/data.types";

class Feedback extends Entity<IFeedback> implements IFeedback {
  private _formularioId: string;
  private _perguntaId: string;
  private _tipo: TipoPergunta;
  private _resposta_texto?: string;
  private _nota?: number;
  private _opcaoEscolhida?: string;
  private _data_resposta: Date;

  get formularioId() {
    return this._formularioId;
  }

  get perguntaId() {
    return this._perguntaId;
  }

  get tipo() {
    return this._tipo;
  }

  get resposta_texto() {
    return this._resposta_texto;
  }

  get nota() {
    return this._nota;
  }

  get opcaoEscolhida() {
    return this._opcaoEscolhida;
  }

  get data_resposta() {
    return this._data_resposta;
  }

  constructor(props: IFeedback) {
    super(props.id);
    this._formularioId = props.formularioId;
    this._perguntaId = props.perguntaId;
    this._tipo = props.tipo;
    this._resposta_texto = props.resposta_texto ?? undefined;
    this._nota = props.nota;
    this._opcaoEscolhida = props.opcaoEscolhida;
    this._data_resposta = props.data_resposta ?? new Date();
  }

  // Criação com validação
  public static criarFeedback(props: IFeedbackProps): Feedback {
    switch (props.tipo) {
      case TipoPergunta.TEXTO:
        if (!props.resposta_texto || props.resposta_texto.trim() === "") {
          throw new Error("Resposta textual obrigatória.");
        }
        break;
      case TipoPergunta.NOTA:
        if (props.nota === undefined || props.nota < 0 || props.nota > 10) {
          throw new Error("Nota inválida.");
        }
        break;
      case TipoPergunta.MULTIPLA_ESCOLHA:
        if (!props.opcaoEscolhida) {
          throw new Error("Opção da múltipla escolha é obrigatória.");
        }
        break;
    }
  const feedbackCompleto: IFeedback = {
        data_resposta: new Date(),
        ...props,
      };

    return new Feedback(feedbackCompleto);
  }

  public toDTO(): FeedbackDTO {
    return {
      id: this.id,
      formularioId: this._formularioId,
      perguntaId: this._perguntaId,
      tipo: this._tipo,
      resposta_texto: this._resposta_texto,
      nota: this._nota,
      opcaoEscolhida: this._opcaoEscolhida,
      data_resposta: this._data_resposta,
    };
  }
}
// async function montarFeedbackCompleto(feedback: Feedback) {
//   // Suponha que você tenha repositórios para buscar
//   const formulario = await formularioRepository.buscarPorId(feedback.formularioId);
//   return {
//     ...feedback.toDTO(),
//     formulario,
//     pergunta,
//   };
// }

export { Feedback };
