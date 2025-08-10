"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const data_types_1 = require("@shared/domain/data.types");
const feedback_exceptions_1 = require("./feedback.exceptions");
const entity_1 = require("@shared/domain/entity");
const crypto_1 = require("crypto");
class Feedback extends entity_1.Entity {
    // Getters
    get formularioId() { return this._formularioId; }
    get envioId() { return this._envioId; }
    get respostas() { return this._respostas; }
    get dataCriacao() { return this._dataCriacao; }
    get dataExclusao() { return this._dataExclusao; }
    // Setters privados
    set formularioId(value) {
        if (!value || value.trim() === '') {
            throw new Error("ID do formulário é obrigatório para o feedback.");
        }
        this._formularioId = value;
    }
    set envioId(value) {
        if (!value || value.trim() === '') {
            throw new Error("ID do envio é obrigatório para o feedback.");
        }
        this._envioId = value;
    }
    set respostas(value) {
        if (!value || value.length === 0) {
            throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Respostas do feedback não podem ser vazias.");
        }
        this._respostas = value;
    }
    set dataCriacao(value) {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new Error("Data de criação inválida.");
        }
        this._dataCriacao = value;
    }
    set dataExclusao(value) { this._dataExclusao = value; }
    // Construtor privado
    constructor(props) {
        super(props.id);
        this.formularioId = props.formularioId;
        this.envioId = props.envioId;
        this._respostas = props.respostas;
        this.dataCriacao = props.dataCriacao;
        this.dataExclusao = props.dataExclusao ?? null;
        this.validarInvariantes();
    }
    validarInvariantes() {
        // A validação agora itera sobre cada resposta no array
        this._respostas.forEach(resposta => {
            const { perguntaId, tipo, resposta_texto, nota, opcaoEscolhida, data_resposta } = resposta;
            if (!perguntaId || typeof perguntaId !== 'string') {
                throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("ID da pergunta é obrigatório na resposta.");
            }
            if (!tipo || !Object.values(data_types_1.TipoPergunta).includes(tipo)) {
                throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Tipo de pergunta é obrigatório e válido na resposta.");
            }
            if (!(data_resposta instanceof Date) || isNaN(data_resposta.getTime())) {
                throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Data da resposta inválida ou ausente.");
            }
            switch (tipo) {
                case data_types_1.TipoPergunta.TEXTO:
                    if (!resposta_texto || typeof resposta_texto !== 'string' || resposta_texto.trim() === "") {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Resposta textual obrigatória para tipo TEXTO.");
                    }
                    if (nota !== undefined || opcaoEscolhida !== undefined) {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Resposta tipo TEXTO não deve conter nota ou opção.");
                    }
                    break;
                case data_types_1.TipoPergunta.NOTA:
                    if (typeof nota !== 'number' || nota < 0 || nota > 10) {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Nota inválida para tipo NOTA (deve ser número entre 0 e 10).");
                    }
                    if (resposta_texto !== undefined || opcaoEscolhida !== undefined) {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Resposta tipo NOTA não deve conter texto ou opção.");
                    }
                    break;
                case data_types_1.TipoPergunta.MULTIPLA_ESCOLHA:
                    if (!opcaoEscolhida || typeof opcaoEscolhida !== 'string' || opcaoEscolhida.trim() === "") {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Opção escolhida obrigatória para tipo MULTIPLA_ESCOLHA.");
                    }
                    if (resposta_texto !== undefined || nota !== undefined) {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Resposta tipo MULTIPLA_ESCOLHA não deve conter texto ou nota.");
                    }
                    break;
                default:
                    throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Tipo de pergunta desconhecido ou inválido na resposta.");
            }
        });
    }
    static criar(props, id) {
        if (!props.envioId || typeof props.envioId !== 'string') {
            throw new Error("ID do envio é obrigatório para criar um feedback.");
        }
        if (!props.formularioId || typeof props.formularioId !== 'string') {
            throw new Error("ID do formulário é obrigatório para criar um feedback.");
        }
        if (!props.respostas || props.respostas.length === 0) {
            throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Respostas do feedback não podem ser vazias.");
        }
        // Mapeia e limpa cada resposta antes de criar a entidade
        const respostasValidadas = props.respostas.map(respostas => {
            const { perguntaId, tipo, resposta_texto, nota, opcaoEscolhida } = respostas;
            if (!perguntaId || typeof perguntaId !== 'string') {
                throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("ID da pergunta é obrigatório na resposta.");
            }
            if (!tipo || !Object.values(data_types_1.TipoPergunta).includes(tipo)) {
                throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Tipo de pergunta é obrigatório e válido na resposta.");
            }
            const respostaLimpa = {
                perguntaId,
                tipo,
                data_resposta: new Date(),
            };
            switch (tipo) {
                case data_types_1.TipoPergunta.TEXTO:
                    if (!resposta_texto || typeof resposta_texto !== 'string' || resposta_texto.trim() === "") {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Resposta textual obrigatória para tipo TEXTO.");
                    }
                    respostaLimpa.resposta_texto = resposta_texto;
                    break;
                case data_types_1.TipoPergunta.NOTA:
                    if (typeof nota !== 'number' || nota < 0 || nota > 10) {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Nota inválida para tipo NOTA (deve ser número entre 0 e 10).");
                    }
                    respostaLimpa.nota = nota;
                    break;
                case data_types_1.TipoPergunta.MULTIPLA_ESCOLHA:
                    if (!opcaoEscolhida || typeof opcaoEscolhida !== 'string' || opcaoEscolhida.trim() === "") {
                        throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Opção escolhida obrigatória para tipo MULTIPLA_ESCOLHA.");
                    }
                    respostaLimpa.opcaoEscolhida = opcaoEscolhida;
                    break;
                default:
                    throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Tipo de pergunta desconhecido ou inválido na resposta.");
            }
            return respostaLimpa;
        });
        const feedbackCompleto = {
            id: id || (0, crypto_1.randomUUID)(),
            formularioId: props.formularioId,
            envioId: props.envioId,
            respostas: respostasValidadas,
            dataCriacao: new Date(),
            dataExclusao: null,
        };
        return new Feedback(feedbackCompleto);
    }
    static recuperar(props) {
        if (!props.id) {
            throw new Error("ID é obrigatório para recuperar Feedback.");
        }
        if (!props.envioId) {
            throw new Error("ID do envio é obrigatório para recuperar Feedback.");
        }
        if (!props.respostas || props.respostas.length === 0) {
            throw new feedback_exceptions_1.FeedbackExceptions.RespostaInvalida("Respostas do feedback não podem ser vazias.");
        }
        return new Feedback(props);
    }
    excluirLogicamente() {
        if (this.dataExclusao !== null) {
            throw new Error("Feedback já está excluído.");
        }
        this.dataExclusao = new Date();
    }
}
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.entity.js.map