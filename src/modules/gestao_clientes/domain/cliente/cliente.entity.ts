import { CriarClienteProps, ICliente } from "./cliente.types";

class Cliente implements ICliente {

    private _id: string;
    private _nome: string;
    private _telefone: string;
    private _email: string;       
    private _cidade: string;
    private _dataCadastro: Date;



    //gets e sets//

    public get id(): string {
        return this._id;
    }
    private set id(value: string) {
        this._id = value;
    }
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }
    public get telefone(): string {
        return this._telefone;
    }
    public set telefone(value: string) {
        this._telefone = value;
    }
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    public get cidade(): string {
        return this._cidade;
    }
    public set cidade(value: string) {
        this._cidade = value;
    }
    public get dataCadastro(): Date {
        return this._dataCadastro;
    }
    public set dataCadastro(value: Date) {
        this._dataCadastro = value;
    }

    //contrutor//
    constructor(props: ICliente) {
        this.id = crypto.randomUUID();
        this.nome = props.nome;
        this.telefone = props.telefone;
        this.cidade = props.cidade;
        this.dataCadastro = new Date();
    }
//metodos//


}
