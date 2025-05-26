
import { Entity } from "@shared/domain/entity";
import { Pessoa } from "@shared/domain/pessoa.entity";
import { IFuncionario, IFuncionarioProps, IRecuperarFuncionarioProps } from "./funcionario.types";

class Funcionario extends Entity<IFuncionario> {

    private _pessoa: Pessoa;
    private _cargo: string;
    private _dataAdimissao: Date;
    private _status: boolean;
   
    public get pessoa(): Pessoa {
        return this._pessoa;
    }
    private set pessoa(pessoa: Pessoa) {
        this._pessoa = pessoa;
    }

     public get cargo(): string {
        return this._cargo;
    }
    private set cargo(cargo: string) {
        this._cargo = cargo;
    }

    public get dataAdimissao(): Date {
        return this._dataAdimissao;
    }

    private set dataAdimissao(dataAdimissao: Date) {
        this._dataAdimissao = dataAdimissao;
    }

    public get status(): boolean {
        return this._status;
    }

    private set status(value: boolean) {
        this._status = value;
    }

    constructor(funcionario: IFuncionario){
        super(funcionario.id)
        this.pessoa = new Pessoa ({
            nome: funcionario.pessoa.nome,
            email: funcionario.pessoa.email,
            telefone: funcionario.pessoa.telefone
        });
        this.cargo = funcionario.cargo;
        this.dataAdimissao = funcionario.dataAdimissao;
        this.status = funcionario.status;
    }

    public static criarFuncionario(funcionario: IFuncionarioProps): Funcionario {
        const {pessoa: { nome, email, telefone }, cargo, dataAdimissao, status} = funcionario;
        return new Funcionario(funcionario)
    }

     public static recuperar(funcionario: IRecuperarFuncionarioProps): Funcionario {
        return new Funcionario(funcionario);
    }

}

export {Funcionario}