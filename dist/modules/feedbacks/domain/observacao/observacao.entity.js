"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observacao = void 0;
class Observacao {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get relatorio_id() {
        return this._relatorio_id;
    }
    set relatorio_id(value) {
        this._relatorio_id = value;
    }
    get conteudo() {
        return this._conteudo;
    }
    set conteudo(value) {
        this._conteudo = value;
    }
    get origem() {
        return this._origem;
    }
    set origem(value) {
        this._origem = value;
    }
    get tipo() {
        return this._tipo;
    }
    set tipo(value) {
        this._tipo = value;
    }
    constructor(id, relatorio_id, conteudo, origem, tipo) {
        id = this.id;
        relatorio_id = this.relatorio_id;
        conteudo = this.conteudo;
        origem = this.origem;
        tipo = this.tipo;
    }
}
exports.Observacao = Observacao;
var Origem;
(function (Origem) {
    Origem[Origem["feedback"] = 0] = "feedback";
    Origem[Origem["relatorio"] = 1] = "relatorio";
    Origem[Origem["manual"] = 2] = "manual";
    Origem[Origem["sistema"] = 3] = "sistema";
    Origem[Origem["evento"] = 4] = "evento";
})(Origem || (Origem = {}));
var Tipo;
(function (Tipo) {
    Tipo[Tipo["alerta"] = 0] = "alerta";
    Tipo[Tipo["elogio"] = 1] = "elogio";
    Tipo[Tipo["sugestao"] = 2] = "sugestao";
    Tipo[Tipo["informativo"] = 3] = "informativo";
    Tipo[Tipo["acao"] = 4] = "acao";
})(Tipo || (Tipo = {}));
//# sourceMappingURL=observacao.entity.js.map