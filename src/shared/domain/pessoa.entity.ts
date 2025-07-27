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
    private set email(email: string) {
         this._email = email;
     }
    public get telefone(): string | undefined {
         return this._telefone;
     }
    private set telefone(telefone: string | undefined) {
         this._telefone = telefone;
     }
   
    constructor(props: PessoaProps) {
        const { nome, email, telefone } = props;

        // Validação do nome
        if (!nome || nome.trim() === '') {
        throw new Error("Nome é obrigatório.");
        }
        this.nome = nome.trim();

            // Validação do e-mail
        if (email !== undefined && email !== null) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
            throw new Error("Email inválido.");
            }
                this.email = email;
            } else {
                this.email = "";
            }
        // Validação do telefone
         if (telefone !== undefined && telefone !== null) {
        const regexTelefone = /^[\d\s()+-]{8,24}$/;
            if (!regexTelefone.test(telefone)) {
            throw new Error("Telefone inválido.");
            }
        this.telefone = telefone;
        }
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
}

export { Pessoa }