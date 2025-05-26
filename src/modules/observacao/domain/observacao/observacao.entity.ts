import { Feedback } from "@modules/feedbacks/domain/feedback/feedback.entity";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Funcionario } from "@modules/gestao_funcionario/domain/funcionario/funcionario.entity";
import { Entity } from "@shared/domain/entity";
import { IObservacao, IObservacaoProps, IRecuperarObservacaoProps } from "./observacao.types";


class Observacao extends Entity<IObservacao> {
    
    // Atributos //
    private _conteudo: string;
    private _tipo: Tipo;
    private _idFormulario: Formulario;
    private _idFuncionario: Funcionario;
    private _idFeedback: Feedback;


    public get conteudo(): string {
        return this._conteudo;
    }

    private set conteudo(value: string) {
        this._conteudo = value;
    }

    public get tipo(): Tipo {
        return this._tipo;
    }

    private set tipo(value: Tipo) {
        this._tipo = value;
    }

     public get idFormulario(): Formulario {
        return this._idFormulario;
    }
    private set idFormulario(idFormulario: Formulario) {
        this._idFormulario = idFormulario;
    }

     public get idFuncionario(): Funcionario {
        return this._idFuncionario;
    }

    private set idFuncionario(idFuncionario: Funcionario) {
        this._idFuncionario = idFuncionario;
    }

       public get idFeedback(): Feedback {
        return this._idFeedback;
    }

    private set idFeedback(idFeedback: Feedback) {
        this._idFeedback = idFeedback;
    }

    constructor(observacao: IObservacao) {
        super(observacao.id)
        this.conteudo = observacao.conteudo;
        this.idFormulario = observacao.idFormulario;
        this.idFuncionario = observacao.idFuncionario;
        this.idFeedback =observacao.idFeedback;
    }

    // Métodos // 
    public static criarObservacao(observacao: IObservacaoProps): Observacao {
        // Criar observacao
        return new Observacao(observacao)
    }

    public static recuperarObservacao(observacao: IRecuperarObservacaoProps): Observacao {
        return new Observacao(observacao)
    }
    

}


enum Tipo {
    alerta,
    elogio,
    sugestao,
    informativo,
    acao
}

export { Observacao };
