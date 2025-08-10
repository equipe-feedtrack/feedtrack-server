"use strict";
// src/modules/formulario/infra/mappers/envio.map.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioMap = void 0;
const envio_entity_ts_1 = require("@modules/formulario/domain/envioformulario/envio.entity.ts");
class EnvioMap {
    /**
     * Converte um objeto do Prisma para a Entidade de Domínio Envio.
     */
    static toDomain(raw) {
        const envioProps = {
            id: raw.id,
            status: raw.status,
            feedbackId: null, // Esta propriedade agora existe e é mapeada
            clienteId: raw.clienteId,
            formularioId: raw.formularioId,
            campanhaId: raw.campanhaId,
            usuarioId: raw.usuarioId,
            dataCriacao: raw.dataCriacao,
            dataEnvio: raw.dataEnvio,
            tentativasEnvio: raw.tentativasEnvio,
            ultimaMensagemErro: raw.ultimaMensagemErro,
        };
        return envio_entity_ts_1.Envio.recuperar(envioProps, raw.id);
    }
    /**
     * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
     */
    static toPersistence(envio) {
        return {
            id: envio.id,
            status: envio.status,
            dataCriacao: envio.dataCriacao,
            dataEnvio: envio.dataEnvio,
            tentativasEnvio: envio.tentativasEnvio,
            ultimaMensagemErro: envio.ultimaMensagemErro,
            // Conecta as relações com as outras entidades
            cliente: { connect: { id: envio.clienteId } },
            formulario: { connect: { id: envio.formularioId } },
            campanha: { connect: { id: envio.campanhaId } },
            usuario: { connect: { id: envio.usuarioId } },
        };
    }
}
exports.EnvioMap = EnvioMap;
//# sourceMappingURL=EnvioMap.js.map