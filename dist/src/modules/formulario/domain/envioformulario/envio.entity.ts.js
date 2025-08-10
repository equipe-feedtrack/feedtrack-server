"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envio = void 0;
const client_1 = require("@prisma/client");
const envio_exceptios_1 = require("./envio.exceptios");
const entity_1 = require("@shared/domain/entity");
const crypto_1 = require("crypto");
class Envio extends entity_1.Entity {
    // Getters
    get status() { return this._status; }
    get feedbackId() { return this._feedbackId; }
    get clienteId() { return this._clienteId; }
    get formularioId() { return this._formularioId; }
    get campanhaId() { return this._campanhaId; } // Getter para o ID da campanha
    get usuarioId() { return this._usuarioId; }
    get dataCriacao() { return this._dataCriacao; }
    get dataEnvio() { return this._dataEnvio; }
    get tentativasEnvio() { return this._tentativasEnvio; }
    get ultimaMensagemErro() { return this._ultimaMensagemErro; }
    // Construtor privado
    constructor(props, id) {
        super(id);
        this._status = props.status;
        this._feedbackId = props.feedbackId;
        this._clienteId = props.clienteId;
        this._formularioId = props.formularioId;
        this._campanhaId = props.campanhaId;
        this._usuarioId = props.usuarioId;
        this._dataCriacao = props.dataCriacao;
        this._dataEnvio = props.dataEnvio;
        this._tentativasEnvio = props.tentativasEnvio;
        this._ultimaMensagemErro = props.ultimaMensagemErro;
        this.validarInvariantes();
    }
    static criar(props, id) {
        const propsCompletas = {
            ...props,
            id: id || (0, crypto_1.randomUUID)(),
            status: client_1.StatusFormulario.PENDENTE,
            dataCriacao: new Date(),
            dataEnvio: null,
            tentativasEnvio: 0,
            ultimaMensagemErro: null,
            feedbackId: null,
        };
        return new Envio(propsCompletas);
    }
    static recuperar(props, id) {
        if (!id) {
            throw new envio_exceptios_1.EnvioExceptions;
        }
        return new Envio(props, id);
    }
    validarInvariantes() {
        if (!this.clienteId) {
            throw new envio_exceptios_1.EnvioInvalidoCliente;
        }
        if (!this.formularioId) {
            throw new envio_exceptios_1.EnvioInvalidoFormulario;
        }
        if (!this.campanhaId) {
            throw new envio_exceptios_1.EnvioInvalidoCampanha;
        }
        if (!this.usuarioId) {
            throw new envio_exceptios_1.EnvioInvalidoUsuario;
        }
    }
    marcarComoEnviado() {
        this._status = client_1.StatusFormulario.ENVIADO;
        this._dataEnvio = new Date();
        this._ultimaMensagemErro = null;
    }
    registrarFalha(mensagemErro) {
        this._status = client_1.StatusFormulario.FALHA;
        this._tentativasEnvio += 1;
        this._ultimaMensagemErro = mensagemErro;
    }
    associarFeedback(feedbackId) {
        if (!feedbackId) {
            throw new envio_exceptios_1.EnvioInvalidoFeedback;
        }
        this._feedbackId = feedbackId;
    }
}
exports.Envio = Envio;
//# sourceMappingURL=envio.entity.ts.js.map