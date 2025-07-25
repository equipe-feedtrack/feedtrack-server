"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pessoa = void 0;
class Pessoa {
    get nome() {
        return this._nome;
    }
    set nome(nome) {
        this._nome = nome;
    }
    get email() {
        return this._email;
    }
    set email(email) {
        this._email = email;
    }
    get telefone() {
        return this._telefone;
    }
    set telefone(telefone) {
        this._telefone = telefone;
    }
    constructor(props) {
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
        }
        else {
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
    dados() {
        return {
            nome: this._nome,
            email: this._email,
            telefone: this._telefone
        };
    }
}
exports.Pessoa = Pessoa;
//# sourceMappingURL=pessoa.entity.js.map