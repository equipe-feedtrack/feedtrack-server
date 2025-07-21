"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observacao = void 0;
const entity_1 = require("@shared/domain/entity");
class Observacao extends entity_1.Entity {
    get conteudo() {
        return this._conteudo;
    }
    set conteudo(value) {
        this._conteudo = value;
    }
    get tipo() {
        return this._tipo;
    }
    set tipo(value) {
        this._tipo = value;
    }
    get idFormulario() {
        return this._idFormulario;
    }
    set idFormulario(idFormulario) {
        this._idFormulario = idFormulario;
    }
    get idFuncionario() {
        return this._idFuncionario;
    }
    set idFuncionario(idFuncionario) {
        this._idFuncionario = idFuncionario;
    }
    get idFeedback() {
        return this._idFeedback;
    }
    set idFeedback(idFeedback) {
        this._idFeedback = idFeedback;
    }
    constructor(observacao) {
        super(observacao.id);
        this.conteudo = observacao.conteudo;
        this.idFormulario = observacao.idFormulario;
        this.idFuncionario = observacao.idFuncionario;
        this.idFeedback = observacao.idFeedback;
    }
    // Métodos // 
    static criarObservacao(observacao) {
        // Criar observacao
        return new Observacao(observacao);
    }
    static recuperarObservacao(observacao) {
        return new Observacao(observacao);
    }
}
exports.Observacao = Observacao;
var Tipo;
(function (Tipo) {
    Tipo[Tipo["alerta"] = 0] = "alerta";
    Tipo[Tipo["elogio"] = 1] = "elogio";
    Tipo[Tipo["sugestao"] = 2] = "sugestao";
    Tipo[Tipo["informativo"] = 3] = "informativo";
    Tipo[Tipo["acao"] = 4] = "acao";
})(Tipo || (Tipo = {}));
//# sourceMappingURL=observacao.entity.js.map