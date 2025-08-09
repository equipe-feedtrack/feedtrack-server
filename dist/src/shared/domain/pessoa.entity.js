"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pessoa = void 0;
const crypto_1 = require("crypto");
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
        this._telefone = typeof telefone === 'string' && telefone.trim() !== '' ? telefone.trim() : null;
    }
    constructor(props) {
        const { nome, email, telefone } = props;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
    }
    static criar(props) {
        const id = (0, crypto_1.randomUUID)(); // Gera um ID único para a nova Pessoa
        return new Pessoa({ ...props, id });
    }
    dados() {
        return {
            nome: this._nome,
            email: this._email,
            telefone: this._telefone
        };
    }
    static recuperar(props) {
        return new Pessoa(props);
    }
    atualizarNome(novoNome) {
        this.nome = novoNome; // Reutiliza o setter
    }
    atualizarEmail(novoEmail) {
        this.email = novoEmail; // Reutiliza o setter
    }
    atualizarTelefone(novoTelefone) {
        this.telefone = novoTelefone; // Reutiliza o setter
    }
}
exports.Pessoa = Pessoa;
//# sourceMappingURL=pessoa.entity.js.map