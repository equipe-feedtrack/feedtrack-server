import { randomUUID } from "crypto";
import { PessoaProps } from "./pessoa.types";

class Pessoa implements PessoaProps {
    private _nome: string;
    private _email: string | null;
    private _telefone: string | null;

    public get nome(): string {
         return this._nome;
     }

    private set nome(nome: string) {
        this._nome = nome;
     }
    public get email(): string | null {
         return this._email;
     }
    private set email(email: string | null) {
         this._email = email;
     }
    public get telefone(): string | null {
         return this._telefone;
     }
    private set telefone(telefone: string | null) {
         this._telefone = typeof telefone === 'string' && telefone.trim() !== '' ? telefone.trim() : null;
     }
   
    constructor(props: PessoaProps) {
        const { nome, email, telefone } = props;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
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

    public atualizarEmail(novoEmail: string | null): void {
    this.email = novoEmail; // Reutiliza o setter
    }

    public atualizarTelefone(novoTelefone: string | null): void {
    this.telefone = novoTelefone; // Reutiliza o setter
    }
    
}

export { Pessoa }