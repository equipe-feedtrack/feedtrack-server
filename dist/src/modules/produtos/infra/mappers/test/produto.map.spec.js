"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const produto_map_1 = require("../produto.map"); // Ajuste o caminho
const crypto_1 = require("crypto");
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
// Importe Status_Produto do PrismaClient se seu schema usa esse nome
// import { Status_Produto } from '@prisma/client'; 
// Mock do Produto.recuperar para isolar o mapper
vitest_1.vi.mock('../../domain/produtos/produto.entity', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        Produto: {
            ...actual.Produto,
            recuperar: vitest_1.vi.fn((props) => new actual.Produto(props)), // Garante que o construtor é chamado com props
            // Se Produto.recuperar tem lógica complexa, o mock pode precisar ser mais detalhado.
        },
    };
});
(0, vitest_1.describe)('ProdutoMap', () => {
    // Dados de mock para a entidade de domínio Produto
    const mockProdutoDomainData = {
        id: (0, crypto_1.randomUUID)(),
        nome: 'Fone Bluetooth XPTO',
        descricao: 'Fone de ouvido com cancelamento de ruído.',
        valor: 299.90,
        dataCriacao: new Date('2024-05-10T10:00:00.000Z'),
        dataAtualizacao: new Date('2024-05-10T11:00:00.000Z'),
        dataExclusao: null,
        ativo: true,
    };
    const mockProdutoDomainSemOpcionaisData = {
        id: (0, crypto_1.randomUUID)(),
        nome: 'Cabo USB C',
        descricao: 'Cabo de carregamento rápido e dados.',
        valor: 25.00,
        dataCriacao: new Date('2024-06-01T08:00:00.000Z'),
        dataAtualizacao: new Date('2024-06-01T09:00:00.000Z'),
        dataExclusao: null, // Mantém null se não especificado
        ativo: true,
    };
    const mockProdutoDomainDeletadoData = {
        id: (0, crypto_1.randomUUID)(),
        nome: 'Carregador Portátil',
        descricao: 'Carregador de bateria de alta capacidade.',
        valor: 120.00,
        dataCriacao: new Date('2024-04-01T10:00:00Z'),
        dataAtualizacao: new Date('2024-04-10T11:00:00Z'),
        dataExclusao: new Date('2024-04-15T12:00:00Z'), // Com data de exclusão
        ativo: false,
    };
    // Instâncias da entidade Produto (criadas usando Produto.recuperar)
    const mockProdutoDomain = produto_entity_1.Produto.recuperar(mockProdutoDomainData);
    const mockProdutoDomainSemOpcionais = produto_entity_1.Produto.recuperar(mockProdutoDomainSemOpcionaisData);
    const mockProdutoDomainDeletado = produto_entity_1.Produto.recuperar(mockProdutoDomainDeletadoData);
    // --- Testes para toDomain ---
    (0, vitest_1.describe)('toDomain', () => {
        // Dados crus (do Prisma) como viriam do banco (snake_case para datas e FK, nomes de enum)
        const rawProdutoPrismaCompleto = {
            id: mockProdutoDomainData.id,
            nome: mockProdutoDomainData.nome,
            descricao: mockProdutoDomainData.descricao,
            valor: mockProdutoDomainData.valor,
            dataCriacao: mockProdutoDomainData.dataCriacao,
            dataAtualizacao: mockProdutoDomainData.dataAtualizacao,
            dataExclusao: mockProdutoDomainData.dataExclusao,
            ativo: mockProdutoDomainData.ativo,
        };
        const rawProdutoPrismaSemOpcionais = {
            id: mockProdutoDomainSemOpcionaisData.id,
            nome: mockProdutoDomainSemOpcionaisData.nome,
            descricao: mockProdutoDomainSemOpcionaisData.descricao,
            valor: mockProdutoDomainSemOpcionaisData.valor,
            dataCriacao: mockProdutoDomainSemOpcionaisData.dataCriacao,
            dataAtualizacao: mockProdutoDomainSemOpcionaisData.dataAtualizacao,
            dataExclusao: null,
            ativo: mockProdutoDomainSemOpcionaisData.ativo,
        };
        (0, vitest_1.it)('deve converter dados crus do Prisma para uma entidade Produto completa', () => {
            const produto = produto_map_1.ProdutoMap.toDomain(rawProdutoPrismaCompleto);
            (0, vitest_1.expect)(produto).toBeInstanceOf(produto_entity_1.Produto);
            (0, vitest_1.expect)(produto.id).toBe(rawProdutoPrismaCompleto.id);
            (0, vitest_1.expect)(produto.nome).toBe(rawProdutoPrismaCompleto.nome);
            (0, vitest_1.expect)(produto.descricao).toBe(rawProdutoPrismaCompleto.descricao);
            (0, vitest_1.expect)(produto.valor).toBe(rawProdutoPrismaCompleto.valor);
            (0, vitest_1.expect)(produto.dataCriacao).toEqual(rawProdutoPrismaCompleto.dataCriacao); // Mapeia snake_case para camelCase
            (0, vitest_1.expect)(produto.dataAtualizacao).toEqual(rawProdutoPrismaCompleto.dataAtualizacao);
            (0, vitest_1.expect)(produto.dataExclusao).toEqual(rawProdutoPrismaCompleto.dataExclusao);
            (0, vitest_1.expect)(produto.ativo).toBe(rawProdutoPrismaCompleto.ativo);
        });
        (0, vitest_1.it)('deve converter dados crus do Prisma com campos null para entidade com undefined/null corretamente', () => {
            const produto = produto_map_1.ProdutoMap.toDomain(rawProdutoPrismaSemOpcionais);
            (0, vitest_1.expect)(produto.dataExclusao).toBeNull();
        });
    });
    // --- Testes para toPersistence ---
    (0, vitest_1.describe)('toPersistence', () => {
        (0, vitest_1.it)('deve converter uma entidade Produto completa para um objeto de persistência do Prisma', () => {
            const persistenceData = produto_map_1.ProdutoMap.toPersistence(mockProdutoDomain);
            (0, vitest_1.expect)(persistenceData).toEqual({
                id: mockProdutoDomain.id,
                nome: mockProdutoDomain.nome,
                descricao: mockProdutoDomain.descricao,
                valor: mockProdutoDomain.valor,
                data_criacao: mockProdutoDomain.dataCriacao, // Mapeia camelCase para snake_case
                data_atualizacao: mockProdutoDomain.dataAtualizacao,
                data_exclusao: mockProdutoDomain.dataExclusao,
                ativo: mockProdutoDomain.ativo,
            });
        });
        (0, vitest_1.it)('deve converter uma entidade Produto sem opcionais para persistência com null/undefined', () => {
            const persistenceData = produto_map_1.ProdutoMap.toPersistence(mockProdutoDomainSemOpcionais);
            (0, vitest_1.expect)(persistenceData.data_exclusao).toBeNull(); // undefined na entidade -> null no DB
        });
    });
    // --- Testes para toDTO ---
    (0, vitest_1.describe)('toDTO', () => {
        (0, vitest_1.it)('deve converter uma entidade Produto completa para ProdutoResponseDTO', () => {
            const dto = produto_map_1.ProdutoMap.toDTO(mockProdutoDomain);
            (0, vitest_1.expect)(dto).toEqual({
                id: mockProdutoDomain.id,
                nome: mockProdutoDomain.nome,
                descricao: mockProdutoDomain.descricao,
                valor: mockProdutoDomain.valor,
                dataCriacao: mockProdutoDomain.dataCriacao.toISOString(),
                dataAtualizacao: mockProdutoDomain.dataAtualizacao.toISOString(),
                dataExclusao: mockProdutoDomain.dataExclusao?.toISOString(), // Trata null
                ativo: mockProdutoDomain.ativo,
            });
        });
        (0, vitest_1.it)('deve converter uma entidade Produto com dataExclusao para DTO corretamente', () => {
            const dto = produto_map_1.ProdutoMap.toDTO(mockProdutoDomainDeletado);
            (0, vitest_1.expect)(dto.dataExclusao).toBe(mockProdutoDomainDeletado.dataExclusao?.toISOString());
            (0, vitest_1.expect)(dto.ativo).toBe(false);
        });
    });
});
//# sourceMappingURL=produto.map.spec.js.map