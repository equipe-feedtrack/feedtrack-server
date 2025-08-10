"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const produto_entity_1 = require("../produto.entity"); // Ajuste o caminho
const produto_exception_1 = require("../produto.exception"); // Suas exceções de produto
const crypto_1 = require("crypto"); // Para IDs
(0, vitest_1.describe)('Entidade Produto', () => {
    // Configuração para controlar o tempo em testes de data
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    // Mocks de dados base para Produto
    const baseProps = {
        nome: 'Notebook Gamer Xtreme',
        descricao: 'Um notebook de alta performance para jogos e trabalho.',
        valor: 7500.00,
    };
    // --- Testes para o método 'criarProduto' ---
    (0, vitest_1.it)('deve criar um novo produto com dados completos e status ATIVO por padrão', () => {
        const produto = produto_entity_1.Produto.criarProduto(baseProps);
        (0, vitest_1.expect)(produto).toBeInstanceOf(produto_entity_1.Produto);
        (0, vitest_1.expect)(produto.id).toBeDefined();
        (0, vitest_1.expect)(produto.nome).toBe(baseProps.nome);
        (0, vitest_1.expect)(produto.descricao).toBe(baseProps.descricao);
        (0, vitest_1.expect)(produto.valor).toBe(baseProps.valor);
        (0, vitest_1.expect)(produto.ativo).toBe(true); // Padrão
        (0, vitest_1.expect)(produto.dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(produto.dataAtualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(produto.dataExclusao).toBeNull();
    });
    (0, vitest_1.it)('deve criar um produto com status INATIVO se especificado', () => {
        const produto = produto_entity_1.Produto.criarProduto({ ...baseProps });
        (0, vitest_1.expect)(produto.ativo).toBe(true); // Ativo no sentido de existir, não de status do produto
    });
    (0, vitest_1.it)('deve lançar erro se o nome do produto for muito curto', () => {
        (0, vitest_1.expect)(() => produto_entity_1.Produto.criarProduto({ ...baseProps, nome: 'Mini' })).toThrowError(produto_exception_1.ProdutoExceptions.NomeProdutoTamanhoMinimoInvalido);
    });
    (0, vitest_1.it)('deve lançar erro se o nome do produto for muito longo', () => {
        (0, vitest_1.expect)(() => produto_entity_1.Produto.criarProduto({ ...baseProps, nome: 'a'.repeat(51) })).toThrowError(produto_exception_1.ProdutoExceptions.NomeProdutoTamanhoMaximoInvalido);
    });
    (0, vitest_1.it)('deve lançar erro se a descrição do produto for muito curta', () => {
        (0, vitest_1.expect)(() => produto_entity_1.Produto.criarProduto({ ...baseProps, descricao: 'Curta' })).toThrowError(produto_exception_1.ProdutoExceptions.DescricaoProdutoTamanhoMinimoInvalido);
    });
    (0, vitest_1.it)('deve lançar erro se a descrição do produto for muito longa', () => {
        (0, vitest_1.expect)(() => produto_entity_1.Produto.criarProduto({ ...baseProps, descricao: 'a'.repeat(201) })).toThrowError(produto_exception_1.ProdutoExceptions.DescricaoProdutoTamanhoMaximoInvalido);
    });
    (0, vitest_1.it)('deve lançar erro se o valor do produto for negativo', () => {
        (0, vitest_1.expect)(() => produto_entity_1.Produto.criarProduto({ ...baseProps, valor: -10 })).toThrowError(produto_exception_1.ProdutoExceptions.ValorMinimoProdutoInvalido);
    });
    // --- Testes para o método 'recuperar' ---
    (0, vitest_1.it)('deve recuperar um produto existente corretamente', () => {
        const recuperacaoProps = {
            id: (0, crypto_1.randomUUID)(),
            nome: 'Mouse Sem Fio',
            descricao: 'Mouse ergonômico para maior conforto.',
            valor: 150.00,
            dataCriacao: new Date('2024-01-01T00:00:00Z'),
            dataAtualizacao: new Date('2024-01-01T00:00:00Z'),
            dataExclusao: new Date('2024-02-01T00:00:00Z'), // Excluído logicamente
            ativo: false, // Inativo
        };
        const produto = produto_entity_1.Produto.recuperar(recuperacaoProps);
        (0, vitest_1.expect)(produto).toBeInstanceOf(produto_entity_1.Produto);
        (0, vitest_1.expect)(produto.id).toBe(recuperacaoProps.id);
        (0, vitest_1.expect)(produto.nome).toBe(recuperacaoProps.nome);
        (0, vitest_1.expect)(produto.descricao).toBe(recuperacaoProps.descricao);
        (0, vitest_1.expect)(produto.valor).toBe(recuperacaoProps.valor);
        (0, vitest_1.expect)(produto.ativo).toBe(false);
        (0, vitest_1.expect)(produto.dataExclusao).toEqual(recuperacaoProps.dataExclusao);
    });
    (0, vitest_1.it)('deve verificar se o produto está deletado corretamente', () => {
        const produtoAtivo = produto_entity_1.Produto.criarProduto(baseProps);
        (0, vitest_1.expect)(produtoAtivo.estaDeletado()).toBe(false);
        const produtoDeletado = produto_entity_1.Produto.recuperar({
            ...baseProps,
            id: (0, crypto_1.randomUUID)(),
            dataExclusao: new Date(),
            ativo: false,
            dataCriacao: new Date(), // Necessário para RecuperarProdutoProps
            dataAtualizacao: new Date(), // Necessário para RecuperarProdutoProps
        });
        (0, vitest_1.expect)(produtoDeletado.estaDeletado()).toBe(true);
    });
});
//# sourceMappingURL=produto.entity.spec.js.map