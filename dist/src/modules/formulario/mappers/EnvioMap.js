"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioMap = void 0;
const envio_entity_ts_js_1 = require("../domain/envioformulario/domain/envio.entity.ts.js");
class EnvioMap {
    static toDomain(raw) {
        // @ts-ignore // O construtor é privado, mas o Mapper tem permissão para usá-lo
        return new envio_entity_ts_js_1.Envio({
            id: raw.id,
            clienteId: raw.clienteId,
            usuarioId: raw.usuarioId,
            formularioId: raw.formularioId,
            feedbackId: raw.feedbackId,
            status: raw.status,
            dataCriacao: raw.dataCriacao,
            dataEnvio: raw.dataEnvio,
            tentativasEnvio: raw.tentativasEnvio,
            ultimaMensagemErro: raw.ultimaMensagemErro,
        });
    }
    static toPersistence(envio) {
        return {
            id: envio.props.id,
            clienteId: envio.props.clienteId,
            usuarioId: envio.props.usuarioId,
            formularioId: envio.props.formularioId,
            feedbackId: envio.props.feedbackId,
            status: envio.props.status,
            dataCriacao: envio.props.dataCriacao,
            dataEnvio: envio.props.dataEnvio,
            tentativasEnvio: envio.props.tentativasEnvio,
            ultimaMensagemErro: envio.props.ultimaMensagemErro,
        };
    }
    static toDTO(envio) {
        return {
            id: envio.id,
            status: envio.status,
            feedbackId: envio.feedbackId,
            clienteId: envio.clienteId,
            formularioId: envio.props.formularioId,
            dataCriacao: envio.props.dataCriacao.toISOString(),
            dataEnvio: envio.props.dataEnvio ? envio.props.dataEnvio.toISOString() : null,
            erro: envio.props.ultimaMensagemErro,
        };
    }
}
exports.EnvioMap = EnvioMap;
//# sourceMappingURL=EnvioMap.js.map