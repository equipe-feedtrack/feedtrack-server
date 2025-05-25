
import { Entity } from "@shared/domain/entity";
import { Pessoa } from "@shared/domain/pessoa.entity";
import { IFuncionario, IFuncionarioProps, IRecuperarFuncionarioProps } from "./funcionario.types";

class Funcionario extends Entity<IFuncionario> {

    private _pessoa: Pessoa;
    private _cargo: string;
   
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

    constructor(funcionario: IFuncionario){
        super(funcionario.id)
        this.pessoa = new Pessoa ({
            nome: funcionario.nome,
            email: funcionario.email,
            telefone: funcionario.telefone
        });
        this.cargo = funcionario.cargo;
    }

    criarFuncionario(funcionario: IFuncionarioProps): Funcionario {
        const {nome, email, telefone, cargo} = funcionario;

        return new Funcionario(funcionario)
    }

     public static recuperar(funcionario: IRecuperarFuncionarioProps): Funcionario {
    return new Funcionario(funcionario);
    }

}

export {Funcionario}