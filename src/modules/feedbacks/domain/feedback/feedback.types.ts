// Tdos os atributos e todas as propriedades que um feedback deve ter
interface IFeedback {
    
    id: string;
    formulario_id: string;
    pergunta_id: number;
    resposta_texto: string;
    nota: number;
    data_resposta: Date;

}

type CriarFeedbackProps =  Omit <IFeedback, "id"> // Omita o id de Ifeedback na hora de criar um feedback.

export {IFeedback, CriarFeedbackProps}