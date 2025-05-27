import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";

// Tdos os atributos e todas as propriedades que um feedback deve ter
interface IFeedback {
    id?: string;
    formulario: Formulario;
    resposta_texto?: string;
    nota?: number;
    data_resposta: Date;
}

type IFeedbackProps =  Omit <IFeedback, "id"> // Omita o id de Ifeedback na hora de criar um feedback.

type IRecuperarFeedbackProps = Required<IFeedback>;

export {IFeedback, IFeedbackProps, IRecuperarFeedbackProps}