"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
class Feedback {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get formulario_id() {
        return this._formulario_id;
    }
    set formulario_id(value) {
        this._formulario_id = value;
    }
    get pergunta_id() {
        return this._pergunta_id;
    }
    set pergunta_id(value) {
        this._pergunta_id = value;
    }
    get resposta_texto() {
        return this._resposta_texto;
    }
    set resposta_texto(value) {
        this._resposta_texto = value;
    }
    get nota() {
        return this._nota;
    }
    set nota(value) {
        this._nota = value;
    }
    get data_resposta() {
        return this._data_resposta;
    }
    set data_resposta(value) {
        this._data_resposta = value;
    }
    constructor(feedback) {
        this.id = feedback.id;
        this.formulario_id = feedback.formulario_id;
        this.pergunta_id = feedback.pergunta_id;
        this.resposta_texto = feedback.resposta_texto;
        this.nota = feedback.nota;
        this.data_resposta = feedback.data_resposta;
    }
    //Métodos//
    static criar(props) {
        let { formulario_id, pergunta_id, resposta_texto, nota, data_resposta } = props;
        const id = "12345"; // ou use UUID
        return new Feedback({
            id,
            formulario_id,
            pergunta_id,
            resposta_texto,
            nota,
            data_resposta: data_resposta ?? new Date()
        });
        // Ajustar para os inputs do front.
    }
}
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.entity.js.map