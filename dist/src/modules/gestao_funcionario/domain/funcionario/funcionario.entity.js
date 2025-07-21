"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcionario = void 0;
const entity_1 = require("@shared/domain/entity");
const pessoa_entity_1 = require("@shared/domain/pessoa.entity");
class Funcionario extends entity_1.Entity {
    get pessoa() {
        return this._pessoa;
    }
    set pessoa(pessoa) {
        this._pessoa = pessoa;
    }
    get cargo() {
        return this._cargo;
    }
    set cargo(cargo) {
        this._cargo = cargo;
    }
    get dataAdimissao() {
        return this._dataAdimissao;
    }
    set dataAdimissao(dataAdimissao) {
        this._dataAdimissao = dataAdimissao;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    constructor(funcionario) {
        super(funcionario.id);
        this.pessoa = new pessoa_entity_1.Pessoa({
            nome: funcionario.pessoa.nome,
            email: funcionario.pessoa.email,
            telefone: funcionario.pessoa.telefone
        });
        this.cargo = funcionario.cargo;
        this.dataAdimissao = funcionario.dataAdimissao;
        this.status = funcionario.status;
    }
    static criarFuncionario(funcionario) {
        const { pessoa: { nome, email, telefone }, cargo, dataAdimissao, status } = funcionario;
        return new Funcionario(funcionario);
    }
    static recuperar(funcionario) {
        return new Funcionario(funcionario);
    }
}
exports.Funcionario = Funcionario;
//# sourceMappingURL=funcionario.entity.js.map