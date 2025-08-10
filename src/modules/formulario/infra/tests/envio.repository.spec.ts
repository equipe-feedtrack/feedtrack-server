import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PrismaClient, StatusFormulario, EnvioFormulario as EnvioPrisma } from '@prisma/client';
import { Envio } from '@modules/formulario/domain/envioformulario/envio.entity.ts';
import { EnvioRepositoryPrisma } from '../envio/EnvioRepositoryPrisma';

// Mock do PrismaClient para isolar os testes do banco de dados real
vi.mock('@prisma/client', () => {
    const mockPrisma = {
        envioFormulario: {
            upsert: vi.fn(),
            findUnique: vi.fn(),
            findMany: vi.fn(),
        },
        $transaction: vi.fn(async (callback) => await callback(mockPrisma)),
    };
    return {
        PrismaClient: vi.fn(() => mockPrisma),
        StatusFormulario: { PENDENTE: 'PENDENTE', ENVIADO: 'ENVIADO', FALHA: 'FALHA' },
    };
});

describe('EnvioRepositoryPrisma', () => {
    let prisma: PrismaClient;
    let repo: EnvioRepositoryPrisma;

    beforeEach(() => {
        vi.clearAllMocks();
        prisma = new PrismaClient();
        repo = new EnvioRepositoryPrisma(prisma);
    });

    // UUIDs fixos para os testes
    const fixedUuids = {
        envioId: '47f2e146-2a7e-4b6a-9f4c-8f1234567890',
        clienteId: 'c1c1c1c1-1111-4111-8111-111111111111',
        formularioId: 'f2f2f2f2-2222-4222-8222-222222222222',
        campanhaId: 'a3a3a3a3-3333-4333-8333-333333333333',
        usuarioId: 'u4u4u4u4-4444-4444-8444-444444444444',
    };

    // --- Testes para o método salvar (upsert) ---
    it('deve salvar um novo envio', async () => {
        const { envioId, clienteId, formularioId, campanhaId, usuarioId } = fixedUuids;

        const envioEntity = Envio.criar({
            clienteId: clienteId,
            formularioId: formularioId,
            campanhaId: campanhaId,
            usuarioId: usuarioId,
        }, envioId);

        vi.mocked(prisma.envioFormulario.upsert).mockResolvedValueOnce(envioEntity as any);

        await repo.salvar(envioEntity);

        expect(prisma.envioFormulario.upsert).toHaveBeenCalledWith({
            where: { id: envioEntity.id },
            create: {
                id: envioId,
                status: StatusFormulario.PENDENTE,
                dataCriacao: expect.any(Date),
                dataEnvio: null,
                tentativasEnvio: 0,
                ultimaMensagemErro: null,
                cliente: { connect: { id: clienteId } },
                formulario: { connect: { id: formularioId } },
                campanha: { connect: { id: campanhaId } },
                usuario: { connect: { id: usuarioId } },
            },
            update: {
                status: StatusFormulario.PENDENTE,
                dataEnvio: null,
                tentativasEnvio: 0,
                ultimaMensagemErro: null,
            },
        });
    });

    // --- Testes para o método salvarVarios ---
    it('deve salvar múltiplos envios em uma transação', async () => {
        const envios = [
            Envio.criar({ clienteId: fixedUuids.clienteId, formularioId: fixedUuids.formularioId, campanhaId: fixedUuids.campanhaId, usuarioId: fixedUuids.usuarioId }),
            Envio.criar({ clienteId: fixedUuids.clienteId, formularioId: fixedUuids.formularioId, campanhaId: fixedUuids.campanhaId, usuarioId: fixedUuids.usuarioId }),
        ];

        vi.mocked(prisma.$transaction).mockResolvedValueOnce([{}, {}] as any);

        await repo.salvarVarios(envios);

        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(vi.mocked(prisma.envioFormulario.upsert)).toHaveBeenCalledTimes(2);
    });


    // --- Testes para o método buscarPorId ---
    it('deve buscar um envio por ID e retornar a entidade de domínio', async () => {
        const { envioId, clienteId, formularioId, campanhaId, usuarioId } = fixedUuids;
        const mockPrismaResult: EnvioPrisma = {
            id: envioId,
            status: StatusFormulario.PENDENTE,
            clienteId,
            formularioId,
            campanhaId,
            usuarioId,
            dataCriacao: new Date(),
            dataEnvio: null,
            tentativasEnvio: 0,
            ultimaMensagemErro: null,
        };

        vi.mocked(prisma.envioFormulario.findUnique).mockResolvedValueOnce(mockPrismaResult);

        const result = await repo.buscarPorId(envioId);

        expect(prisma.envioFormulario.findUnique).toHaveBeenCalledWith({ where: { id: envioId } });
        expect(result).toBeInstanceOf(Envio);
        expect(result?.id).toBe(envioId);
    });

    it('deve retornar null se o envio não for encontrado', async () => {
        vi.mocked(prisma.envioFormulario.findUnique).mockResolvedValueOnce(null);

        const result = await repo.buscarPorId('non-existent-id');

        expect(result).toBeNull();
    });
});
