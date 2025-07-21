"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const entity_1 = require("@shared/domain/entity");
const data_types_1 = require("@shared/domain/data.types");
class Feedback extends entity_1.Entity {
    get formularioId() {
        return this._formularioId;
    }
    get perguntaId() {
        return this._perguntaId;
    }
    get tipo() {
        return this._tipo;
    }
    get resposta_texto() {
        return this._resposta_texto;
    }
    get nota() {
        return this._nota;
    }
    get opcaoEscolhida() {
        return this._opcaoEscolhida;
    }
    get data_resposta() {
        return this._data_resposta;
    }
    constructor(props) {
        super(props.id);
        this._formularioId = props.formularioId;
        this._perguntaId = props.perguntaId;
        this._tipo = props.tipo;
        this._resposta_texto = props.resposta_texto ?? undefined;
        this._nota = props.nota;
        this._opcaoEscolhida = props.opcaoEscolhida;
        this._data_resposta = props.data_resposta ?? new Date();
    }
    // Criação com validação
    static criarFeedback(props) {
        switch (props.tipo) {
            case data_types_1.TipoPergunta.TEXTO:
                if (!props.resposta_texto || props.resposta_texto.trim() === "") {
                    throw new Error("Resposta textual obrigatória.");
                }
                break;
            case data_types_1.TipoPergunta.NOTA:
                if (props.nota === undefined || props.nota < 0 || props.nota > 10) {
                    throw new Error("Nota inválida.");
                }
                break;
            case data_types_1.TipoPergunta.MULTIPLA_ESCOLHA:
                if (!props.opcaoEscolhida) {
                    throw new Error("Opção da múltipla escolha é obrigatória.");
                }
                break;
        }
        const feedbackCompleto = {
            data_resposta: new Date(),
            ...props,
        };
        return new Feedback(feedbackCompleto);
    }
    toDTO() {
        return {
            id: this.id,
            formularioId: this._formularioId,
            perguntaId: this._perguntaId,
            tipo: this._tipo,
            resposta_texto: this._resposta_texto,
            nota: this._nota,
            opcaoEscolhida: this._opcaoEscolhida,
            data_resposta: this._data_resposta,
        };
    }
}
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.entity.js.map