"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const entity_1 = require("@shared/domain/entity");
const pessoa_entity_1 = require("@shared/domain/pessoa.entity");
class Usuario extends entity_1.Entity {
    get pessoa() {
        return this._pessoa;
    }
    set pessoa(pessoa) {
        this._pessoa = pessoa;
    }
    get usuario() {
        return this._usuario;
    }
    set usuario(usuario) {
        this._usuario = usuario;
    }
    get senha() {
        return this._senha;
    }
    set senha(senha) {
        this._senha = senha;
    }
    get tipo() {
        return this._tipo;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
    constructor(user) {
        super(user.id);
        this.pessoa = new pessoa_entity_1.Pessoa({
            nome: user.nome,
            email: user.email
        });
        this.usuario = user.usuario;
        this.senha = user.senha;
        this.tipo = user.tipo;
    }
    static criarUsuario(user) {
        const { nome, email, usuario, senha, tipo } = user;
        //Colocar as validações para a criação do usuário.
        return new Usuario(user);
    }
    static recuperar(user) {
        return new Usuario(user);
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.entity.js.map