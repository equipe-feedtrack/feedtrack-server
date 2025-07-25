"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envio = void 0;
const crypto_1 = require("crypto");
class Envio {
    get id() { return this.props.id; }
    get status() { return this.props.status; }
    get feedbackId() { return this.props.feedbackId; }
    get clienteId() { return this.props.clienteId; }
    constructor(props) {
        this.props = props;
    }
    static criar(props) {
        const envioProps = {
            id: (0, crypto_1.randomUUID)(),
            ...props,
            status: 'PENDENTE',
            dataCriacao: new Date(),
            tentativasEnvio: 0,
        };
        return new Envio(envioProps);
    }
    marcarComoEnviado() {
        if (this.props.status === 'ENVIADO')
            return; // Evita múltiplas marcações
        this.props.status = 'ENVIADO';
        this.props.dataEnvio = new Date();
        this.props.ultimaMensagemErro = null;
    }
    marcarComoFalha(motivo) {
        this.props.status = 'FALHA';
        this.props.tentativasEnvio += 1;
        this.props.ultimaMensagemErro = motivo;
    }
}
exports.Envio = Envio;
//# sourceMappingURL=envio.entity.ts.js.map