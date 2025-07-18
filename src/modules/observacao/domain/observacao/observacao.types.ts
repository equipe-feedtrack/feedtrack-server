import { Feedback } from "@modules/feedbacks/domain/feedback.entity";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Funcionario } from "@modules/gestao_funcionario/domain/funcionario/funcionario.entity";

interface IObservacao {
    id?:string;
    conteudo: string;
    idFormulario: Formulario;
    idFuncionario: Funcionario;
    idFeedback: Feedback;
    dataObservacao: Date;
    autor: boolean;
}

type IObservacaoProps = Omit<IObservacao, "id">;

type IRecuperarObservacaoProps = Required<IObservacao>;

export {IObservacao, IObservacaoProps, IRecuperarObservacaoProps}