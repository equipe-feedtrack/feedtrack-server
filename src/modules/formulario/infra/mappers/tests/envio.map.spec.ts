import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { StatusFormulario } from '@prisma/client';

import { EnvioFormulario as EnvioPrisma } from '@prisma/client';
import { EnvioMap } from '../EnvioMap';
import { Envio } from '@modules/formulario/domain/envioformulario/envio.entity.ts';

describe('EnvioMap', () => {
    // Geração de dados de teste
    const envioId = randomUUID();
    const clienteId = randomUUID();
    const formularioId = randomUUID();
    const campanhaId = randomUUID();
    const usuarioId = randomUUID();
    const feedbackId = randomUUID();
    const dataCriacao = new Date();
    const dataEnvio = new Date();

    const envioEntity = Envio.recuperar({
        id: envioId,
        status: StatusFormulario.ENVIADO,
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

    const envioPrisma: EnvioPrisma = {
        id: envioId,
        status: StatusFormulario.ENVIADO,
        clienteId,
        formularioId,
        campanhaId,
        usuarioId,
        dataCriacao,
        dataEnvio,
        tentativasEnvio: 1,
        ultimaMensagemErro: null,
    };

    it('deve converter um objeto do Prisma para a entidade de domínio', () => {
        const domainEntity = EnvioMap.toDomain(envioPrisma);

        expect(domainEntity).toBeInstanceOf(Envio);
        expect(domainEntity.id).toBe(envioPrisma.id);
        expect(domainEntity.status).toBe(envioPrisma.status);
        expect(domainEntity.clienteId).toBe(envioPrisma.clienteId);
        expect(domainEntity.formularioId).toBe(envioPrisma.formularioId);
        expect(domainEntity.campanhaId).toBe(envioPrisma.campanhaId);
        expect(domainEntity.usuarioId).toBe(envioPrisma.usuarioId);
        expect(domainEntity.dataCriacao).toEqual(envioPrisma.dataCriacao);
        expect(domainEntity.dataEnvio).toEqual(envioPrisma.dataEnvio);
        expect(domainEntity.tentativasEnvio).toBe(envioPrisma.tentativasEnvio);
        expect(domainEntity.ultimaMensagemErro).toBe(envioPrisma.ultimaMensagemErro);
    });

    it('deve converter uma entidade de domínio para o formato de persistência do Prisma', () => {
        const persistenceData = EnvioMap.toPersistence(envioEntity);

        expect(persistenceData.id).toBe(envioEntity.id);
        expect(persistenceData.status).toBe(envioEntity.status);
        expect(persistenceData.dataCriacao).toEqual(envioEntity.dataCriacao);
        expect(persistenceData.dataEnvio).toEqual(envioEntity.dataEnvio);
        expect(persistenceData.tentativasEnvio).toBe(envioEntity.tentativasEnvio);
        expect(persistenceData.ultimaMensagemErro).toBe(envioEntity.ultimaMensagemErro);
        // Verificando as conexões
        expect((persistenceData.cliente as any).connect.id).toBe(envioEntity.clienteId);
        expect((persistenceData.formulario as any).connect.id).toBe(envioEntity.formularioId);
        expect((persistenceData.campanha as any).connect.id).toBe(envioEntity.campanhaId);
        expect((persistenceData.usuario as any).connect.id).toBe(envioEntity.usuarioId);
    });
});
