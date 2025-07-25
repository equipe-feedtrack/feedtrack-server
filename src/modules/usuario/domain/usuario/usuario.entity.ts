import { Entity } from "@shared/domain/entity";
import { Pessoa } from "@shared/domain/pessoa.entity";
import { IRecuperarUsuarioProps, IUsuario, IUsuarioProps, Tipo } from "./usuario.types";

class Usuario extends Entity<IUsuario>{
    private _pessoa: Pessoa;
    private _usuario: string;
    private _senha: string;
    private _tipo: Tipo;

     public get pessoa(): Pessoa {
        return this._pessoa;
    }
    private set pessoa(pessoa: Pessoa) {
        this._pessoa = pessoa;
    }
     public get usuario(): string {
        return this._usuario;
    }
    private set usuario(usuario: string) {
        this._usuario = usuario;
    }
    public get senha(): string {
        return this._senha;
    }
    private set senha(senha: string) {
        this._senha = senha;
    }
    public get tipo(): Tipo {
        return this._tipo;
    }
    private set tipo(tipo: Tipo) {
        this._tipo = tipo;
    }

    constructor(user: IUsuario){
        super(user.id)
        this.pessoa = new Pessoa ({
            nome: user.nome,
            email: user.email
        });
        this.usuario = user.usuario;
        this.senha = user.senha;
        this.tipo = user.tipo;
    }

    public static criarUsuario(user: IUsuarioProps): Usuario {
        const {nome, email, usuario, senha, tipo } = user;
        //Colocar as validações para a criação do usuário.
        return new Usuario(user)
    }
     public static recuperar(user: IRecuperarUsuarioProps): Usuario {
        return new Usuario(user);
    }
    
}

export { Usuario };
