import { Entity } from "@shared/domain/entity";
import {FeedbackDTO, IFeedback, IFeedbackProps, IRecuperarFeedbackProps } from "./feedback.types";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { TipoPergunta } from "@shared/domain/data.types";
import { FeedbackMap } from "@modules/feedbacks/mappers/feedback.map";
import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";

class Feedback extends Entity<IFeedback> implements IFeedback {
  private _formulario: Formulario;
  private _pergunta: Pergunta;
  private _tipo: TipoPergunta;
  private _resposta_texto?: string;
  private _nota?: number;
  private _opcaoEscolhida?: string;
  private _data_resposta: Date;

  public get formulario(): Formulario {
    return this._formulario;
  }

  public get pergunta(): Pergunta {
    return this._pergunta;
  }

  public get tipo(): TipoPergunta {
    return this._tipo;
  }

  public get resposta_texto(): string | undefined {
    return this._resposta_texto;
  }

  public get nota(): number | undefined {
    return this._nota;
  }

  public get opcaoEscolhida(): string | undefined {
    return this._opcaoEscolhida;
  }

  public get data_resposta(): Date {
    return this._data_resposta;
  }

  public constructor(feedback: IFeedback) {
    super(feedback.id);
    this._formulario = feedback.formulario;
    this._pergunta = feedback.pergunta;
    this._tipo = feedback.tipo;
    this._resposta_texto = feedback.resposta_texto;
    this._nota = feedback.nota;
    this._opcaoEscolhida = feedback.opcaoEscolhida;
    this._data_resposta = feedback.data_resposta;
  }


  public static criarFeedback(props: IFeedbackProps): Feedback {
    // Validação baseada no tipo
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

        return new Feedback({
        ...props,
        data_resposta: new Date(),
        });
    }
    public static recuperarFeedback(props: IRecuperarFeedbackProps): Feedback {
    return new Feedback(props);
  }

  public toDTO(): FeedbackDTO {
    return FeedbackMap.toDTO(this);
  }
}

export {Feedback};