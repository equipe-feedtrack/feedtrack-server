"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAtividade = void 0;
const entity_1 = require("@shared/domain/entity"); // Sua classe base Entity
const crypto_1 = require("crypto");
// (Se precisar de exceções para LogAtividade, crie um arquivo log_atividade.exception.ts)
class LogAtividade extends entity_1.Entity {
    // Getters (para expor os dados do log)
    get usuarioId() { return this._usuarioId; }
    get nomeUsuario() { return this._nomeUsuario; }
    get tipoUsuario() { return this._tipoUsuario; }
    get acao() { return this._acao; }
    get entidadeAlvoId() { return this._entidadeAlvoId; }
    get entidadeAlvoTipo() { return this._entidadeAlvoTipo; }
    get detalhes() { return this._detalhes; }
    get dataOcorrencia() { return this._dataOcorrencia; }
    // Setters privados (para validação interna no construtor)
    set usuarioId(value) {
        if (!value || value.trim() === '') {
            throw new Error("ID do usuário é obrigatório para o log.");
        }
        this._usuarioId = value;
    }
    set nomeUsuario(value) {
        if (!value || value.trim() === '') {
            throw new Error("Nome do usuário é obrigatório para o log.");
        }
        this._nomeUsuario = value;
    }
    set tipoUsuario(value) { this._tipoUsuario = value; }
    set acao(value) { this._acao = value; }
    set entidadeAlvoId(value) { this._entidadeAlvoId = value ?? null; }
    set entidadeAlvoTipo(value) { this._entidadeAlvoTipo = value ?? null; }
    set detalhes(value) { this._detalhes = value ?? null; }
    set dataOcorrencia(value) {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new Error("Data de ocorrência inválida para o log.");
        }
        this._dataOcorrencia = value;
    }
    // Construtor privado (recebe um ILogAtividade completo para construir a entidade)
    constructor(log) {
        super(log.id); // ID é obrigatório
        this.usuarioId = log.usuarioId;
        this.nomeUsuario = log.nomeUsuario;
        this.tipoUsuario = log.tipoUsuario;
        this.acao = log.acao;
        this.entidadeAlvoId = log.entidadeAlvoId;
        this.entidadeAlvoTipo = log.entidadeAlvoTipo;
        this.detalhes = log.detalhes;
        this.dataOcorrencia = log.dataOcorrencia;
        // Validações adicionais (ex: se detalhes é um JSON válido se o tipo for JSON)
        this.validarInvariantes();
    }
    validarInvariantes() {
        // Ex: Garantir que dataOcorrencia não seja no futuro
        if (this.dataOcorrencia.getTime() > new Date().getTime() + 1000) { // Tolerância de 1 segundo
            throw new Error("Data de ocorrência do log não pode ser futura.");
        }
    }
    // Método de fábrica para criar um novo registro de LogAtividade
    static criar(props, id) {
        const logCompleto = {
            id: id || (0, crypto_1.randomUUID)(),
            usuarioId: props.usuarioId,
            nomeUsuario: props.nomeUsuario,
            tipoUsuario: props.tipoUsuario,
            acao: props.acao,
            entidadeAlvoId: props.entidadeAlvoId ?? null,
            entidadeAlvoTipo: props.entidadeAlvoTipo ?? null,
            detalhes: props.detalhes ?? null,
            dataOcorrencia: new Date(), // A data de ocorrência é definida no momento da criação do log
        };
        return new LogAtividade(logCompleto);
    }
    // Método de fábrica para recuperar um registro de LogAtividade do banco
    static recuperar(props) {
        return new LogAtividade(props);
    }
}
exports.LogAtividade = LogAtividade;
//# sourceMappingURL=logAtividade.js.map