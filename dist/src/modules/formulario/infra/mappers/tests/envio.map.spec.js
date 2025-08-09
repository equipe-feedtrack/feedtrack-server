"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const EnvioMap_1 = require("../EnvioMap");
const envio_entity_ts_1 = require("@modules/formulario/domain/envioformulario/envio.entity.ts");
(0, vitest_1.describe)('EnvioMap', () => {
    // Geração de dados de teste
    const envioId = (0, crypto_1.randomUUID)();
    const clienteId = (0, crypto_1.randomUUID)();
    const formularioId = (0, crypto_1.randomUUID)();
    const campanhaId = (0, crypto_1.randomUUID)();
    const usuarioId = (0, crypto_1.randomUUID)();
    const feedbackId = (0, crypto_1.randomUUID)();
    const dataCriacao = new Date();
    const dataEnvio = new Date();
    const envioEntity = envio_entity_ts_1.Envio.recuperar({
        id: envioId,
        status: client_1.StatusFormulario.ENVIADO,
        clienteId,
        formularioId,
        campanhaId,
        usuarioId,
        dataCriacao,
        dataEnvio,
        tentativasEnvio: 1,
        ultimaMensagemErro: null,
        feedbackId,
    }, envioId);
    const envioPrisma = {
        id: envioId,
        status: client_1.StatusFormulario.ENVIADO,
        clienteId,
        formularioId,
        campanhaId,
        usuarioId,
        dataCriacao,
        dataEnvio,
        tentativasEnvio: 1,
        ultimaMensagemErro: null,
    };
    (0, vitest_1.it)('deve converter um objeto do Prisma para a entidade de domínio', () => {
        const domainEntity = EnvioMap_1.EnvioMap.toDomain(envioPrisma);
        (0, vitest_1.expect)(domainEntity).toBeInstanceOf(envio_entity_ts_1.Envio);
        (0, vitest_1.expect)(domainEntity.id).toBe(envioPrisma.id);
        (0, vitest_1.expect)(domainEntity.status).toBe(envioPrisma.status);
        (0, vitest_1.expect)(domainEntity.clienteId).toBe(envioPrisma.clienteId);
        (0, vitest_1.expect)(domainEntity.formularioId).toBe(envioPrisma.formularioId);
        (0, vitest_1.expect)(domainEntity.campanhaId).toBe(envioPrisma.campanhaId);
        (0, vitest_1.expect)(domainEntity.usuarioId).toBe(envioPrisma.usuarioId);
        (0, vitest_1.expect)(domainEntity.dataCriacao).toEqual(envioPrisma.dataCriacao);
        (0, vitest_1.expect)(domainEntity.dataEnvio).toEqual(envioPrisma.dataEnvio);
        (0, vitest_1.expect)(domainEntity.tentativasEnvio).toBe(envioPrisma.tentativasEnvio);
        (0, vitest_1.expect)(domainEntity.ultimaMensagemErro).toBe(envioPrisma.ultimaMensagemErro);
    });
    (0, vitest_1.it)('deve converter uma entidade de domínio para o formato de persistência do Prisma', () => {
        const persistenceData = EnvioMap_1.EnvioMap.toPersistence(envioEntity);
        (0, vitest_1.expect)(persistenceData.id).toBe(envioEntity.id);
        (0, vitest_1.expect)(persistenceData.status).toBe(envioEntity.status);
        (0, vitest_1.expect)(persistenceData.dataCriacao).toEqual(envioEntity.dataCriacao);
        (0, vitest_1.expect)(persistenceData.dataEnvio).toEqual(envioEntity.dataEnvio);
        (0, vitest_1.expect)(persistenceData.tentativasEnvio).toBe(envioEntity.tentativasEnvio);
        (0, vitest_1.expect)(persistenceData.ultimaMensagemErro).toBe(envioEntity.ultimaMensagemErro);
        // Verificando as conexões
        (0, vitest_1.expect)(persistenceData.cliente.connect.id).toBe(envioEntity.clienteId);
        (0, vitest_1.expect)(persistenceData.formulario.connect.id).toBe(envioEntity.formularioId);
        (0, vitest_1.expect)(persistenceData.campanha.connect.id).toBe(envioEntity.campanhaId);
        (0, vitest_1.expect)(persistenceData.usuario.connect.id).toBe(envioEntity.usuarioId);
    });
});
//# sourceMappingURL=envio.map.spec.js.map