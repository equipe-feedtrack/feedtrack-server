import { Entity } from "@shared/domain/entity";
import {IFeedback, IFeedbackProps, IRecuperarFeedbackProps } from "./feedback.types";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";

class Feedback extends Entity<IFeedback> implements IFeedback {
    private _formulario: Formulario;
    private _resposta_texto?: string;
    private _nota?: number;
    private _data_resposta: Date;

    public get formulario(): Formulario {
        return this._formulario;
    }

    public get resposta_texto(): string | undefined {
        return this._resposta_texto;
    }

    public get nota(): number | undefined {
        return this._nota;
    }

    public get data_resposta(): Date {
        return this._data_resposta;
    }

    private constructor(props: IFeedback) {
        super(props.id);
        this._formulario = props.formulario;
        this._resposta_texto = props.resposta_texto;
        this._nota = props.nota;
        this._data_resposta = props.data_resposta;
    }

    public static criarFeedback(props: IFeedbackProps): Feedback {
        
        if (!props.resposta_texto && props.nota === undefined) {
        throw new Error("A resposta deve conter um texto ou uma nota.");
        }  
        return new Feedback({
            ...props,
            data_resposta: new Date(),
        });
    };

    // Se usar para leitura apenas:
    public static recuperarFeedback(props: IRecuperarFeedbackProps): Feedback {
        return new Feedback(props);
    }
}


export {Feedback};