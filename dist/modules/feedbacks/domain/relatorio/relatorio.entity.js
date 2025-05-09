"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relatorio = void 0;
class Relatorio {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get tipo_relatorio() {
        return this._tipo_relatorio;
    }
    set tipo_relatorio(value) {
        this._tipo_relatorio = value;
    }
    get filtro() {
        return this._filtro;
    }
    set filtro(value) {
        this._filtro = value;
    }
    get data_geracao() {
        return this._data_geracao;
    }
    set data_geracao(value) {
        this._data_geracao = value;
    }
}
exports.Relatorio = Relatorio;
//# sourceMappingURL=relatorio.entity.js.map