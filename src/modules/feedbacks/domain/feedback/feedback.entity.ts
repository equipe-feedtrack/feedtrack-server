import { Entity } from "@shared/domain/entity";
import {IFeedback, IFeedbackProps, IRecuperarFeedbackProps } from "./feedback.types";

class Feedback extends Entity<IFeedback> implements IFeedback {

    //Atributos//
    // TEM QUE ARRUMAR, FAZER A CORETA LIGAÇÃO COM ENVIOFORMULÁRIO.
    private _formulario_id: string; // Associace com a entidade formulario ainda vai mudar o tipo
    private _pergunta_id: number;
    private _resposta_texto: string;
    private _nota: number;
    private _data_resposta: Date;

    public get formulario_id(): string {
        return this._formulario_id;
    }

    private set formulario_id(value: string) {
        this._formulario_id = value;
    }

    public get pergunta_id(): number {
        return this._pergunta_id;
    }

    private set pergunta_id(value: number) {
        this._pergunta_id = value;
    }

    public get resposta_texto(): string {
        return this._resposta_texto;
    }

    private set resposta_texto(value: string) {
        this._resposta_texto = value;
    }

    public get nota(): number {
        return this._nota;
    }

    private set nota(value: number) {
        this._nota = value;
    }

    public get data_resposta(): Date {
        return this._data_resposta;
    }

    private set data_resposta(value: Date) {
        this._data_resposta = value;
    }

    private constructor(feedback: IFeedback) {
        super(feedback.id)
        this.formulario_id = feedback.formulario_id;
        this.pergunta_id = feedback.pergunta_id;
        this.resposta_texto = feedback.resposta_texto;
        this.nota = feedback.nota;
        this.data_resposta = feedback.data_resposta;
    }

    //Métodos//
    private static criarFeedback(feedback: IFeedbackProps): Feedback {   // Eu posso criar o Feedback sem necessariamente possuir um formulário para envio caso seja feito presencialmente.
        const {formulario_id, pergunta_id, resposta_texto, nota, data_resposta} = feedback;
        //Adicionar as validações (serão feitas em repository).
        return new Feedback(feedback);
    }

    private static recuperarFeedback(feedback: IRecuperarFeedbackProps): Feedback {
        return new Feedback(feedback)
    }
}


export {Feedback};