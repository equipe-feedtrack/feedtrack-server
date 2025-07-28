import { randomUUID } from "crypto";
import { PessoaProps } from "./pessoa.types";

class Pessoa implements PessoaProps {
    private _nome: string;
    private _email?: string;
    private _telefone?: string;

    public get nome(): string {
         return this._nome;
     }

    private set nome(nome: string) {
        this._nome = nome;
     }
    public get email(): string | undefined {
         return this._email;
     }
    private set email(email: string | undefined) {
         this._email = email;
     }
    public get telefone(): string | undefined {
         return this._telefone;
     }
    private set telefone(telefone: string | undefined) {
         this._telefone =telefone;
     }
   
    constructor(props: PessoaProps) {
        const { nome, email, telefone } = props;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email
    }

     public static criar(props: Omit<PessoaProps, 'id'>): Pessoa {
    const id = randomUUID(); // Gera um ID único para a nova Pessoa
    return new Pessoa({ ...props, id });
    }

    public dados() {
        return {
        nome: this._nome,
        email: this._email,
        telefone: this._telefone
        };
    }

    public static recuperar(props: PessoaProps): Pessoa {
        return new Pessoa(props);
    }

    public atualizarNome(novoNome: string): void {
    this.nome = novoNome; // Reutiliza o setter
    }

    public atualizarEmail(novoEmail: string | undefined): void {
    this.email = novoEmail; // Reutiliza o setter
    }

    public atualizarTelefone(novoTelefone: string | undefined): void {
    this.telefone = novoTelefone; // Reutiliza o setter
    }
    
}

export { Pessoa }