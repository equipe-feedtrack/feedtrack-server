"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("@prisma/client");
const EnvioRepositoryPrisma_1 = require("../envio/EnvioRepositoryPrisma");
const envio_entity_ts_1 = require("@modules/formulario/domain/envioformulario/envio.entity.ts");
// Mock do PrismaClient para isolar os testes do banco de dados real
vitest_1.vi.mock('@prisma/client', () => {
    const mockPrisma = {
        envioFormulario: {
            upsert: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            findMany: vitest_1.vi.fn(),
        },
        $transaction: vitest_1.vi.fn(async (callback) => await callback(mockPrisma)),
    };
    return {
        PrismaClient: vitest_1.vi.fn(() => mockPrisma),
        StatusFormulario: { PENDENTE: 'PENDENTE', ENVIADO: 'ENVIADO', FALHA: 'FALHA' },
    };
});
(0, vitest_1.describe)('EnvioRepositoryPrisma', () => {
    let prisma;
    let repo;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        prisma = new client_1.PrismaClient();
        repo = new EnvioRepositoryPrisma_1.EnvioRepositoryPrisma(prisma);
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
    (0, vitest_1.it)('deve salvar um novo envio', async () => {
        const { envioId, clienteId, formularioId, campanhaId, usuarioId } = fixedUuids;
        const envioEntity = envio_entity_ts_1.Envio.criar({
            clienteId: clienteId,
            formularioId: formularioId,
            campanhaId: campanhaId,
            usuarioId: usuarioId,
        }, envioId);
        vitest_1.vi.mocked(prisma.envioFormulario.upsert).mockResolvedValueOnce(envioEntity);
        await repo.salvar(envioEntity);
        (0, vitest_1.expect)(prisma.envioFormulario.upsert).toHaveBeenCalledWith({
            where: { id: envioId },
            create: {
                id: envioId,
                status: client_1.StatusFormulario.PENDENTE,
                dataCriacao: vitest_1.expect.any(Date),
                dataEnvio: null,
                tentativasEnvio: 0,
                ultimaMensagemErro: null,
                cliente: { connect: { id: clienteId } },
                formulario: { connect: { id: formularioId } },
                campanha: { connect: { id: campanhaId } },
                usuario: { connect: { id: usuarioId } },
            },
            update: {
                status: client_1.StatusFormulario.PENDENTE,
                dataEnvio: null,
                tentativasEnvio: 0,
                ultimaMensagemErro: null,
            },
        });
    });
    // --- Testes para o método salvarVarios ---
    (0, vitest_1.it)('deve salvar múltiplos envios em uma transação', async () => {
        const envios = [
            envio_entity_ts_1.Envio.criar({ clienteId: fixedUuids.clienteId, formularioId: fixedUuids.formularioId, campanhaId: fixedUuids.campanhaId, usuarioId: fixedUuids.usuarioId }),
            envio_entity_ts_1.Envio.criar({ clienteId: fixedUuids.clienteId, formularioId: fixedUuids.formularioId, campanhaId: fixedUuids.campanhaId, usuarioId: fixedUuids.usuarioId }),
        ];
        vitest_1.vi.mocked(prisma.$transaction).mockResolvedValueOnce([{}, {}]);
        await repo.salvarVarios(envios);
        (0, vitest_1.expect)(prisma.$transaction).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(vitest_1.vi.mocked(prisma.envioFormulario.upsert)).toHaveBeenCalledTimes(2);
    });
    // --- Testes para o método buscarPorId ---
    (0, vitest_1.it)('deve buscar um envio por ID e retornar a entidade de domínio', async () => {
        const { envioId, clienteId, formularioId, campanhaId, usuarioId } = fixedUuids;
        const mockPrismaResult = {
            id: envioId,
            status: client_1.StatusFormulario.PENDENTE,
            clienteId,
            formularioId,
            campanhaId,
            usuarioId,
            dataCriacao: new Date(),
            dataEnvio: null,
            tentativasEnvio: 0,
            ultimaMensagemErro: null,
        };
        vitest_1.vi.mocked(prisma.envioFormulario.findUnique).mockResolvedValueOnce(mockPrismaResult);
        const result = await repo.buscarPorId(envioId);
        (0, vitest_1.expect)(prisma.envioFormulario.findUnique).toHaveBeenCalledWith({ where: { id: envioId } });
        (0, vitest_1.expect)(result).toBeInstanceOf(envio_entity_ts_1.Envio);
        (0, vitest_1.expect)(result?.id).toBe(envioId);
    });
    (0, vitest_1.it)('deve retornar null se o envio não for encontrado', async () => {
        vitest_1.vi.mocked(prisma.envioFormulario.findUnique).mockResolvedValueOnce(null);
        const result = await repo.buscarPorId('non-existent-id');
        (0, vitest_1.expect)(result).toBeNull();
    });
});
//# sourceMappingURL=envio.repository.spec.js.map