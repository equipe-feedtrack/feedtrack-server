"use strict";
// src/modules/gestao_clientes/domain/test/cliente.entity.spec.ts
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const vitest_1 = require("vitest");
const pessoa_entity_1 = require("@shared/domain/pessoa.entity");
const cliente_entity_1 = require("../cliente.entity");
const cliente_exception_1 = require("../cliente.exception");
const cliente_types_1 = require("../cliente.types");
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
(0, vitest_1.describe)('Entidade Cliente', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    // --- MOCKS DE DADOS ---
    const mockPessoaData = {
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        telefone: '11987654321',
    };
    const mockProdutoData1 = {
        id: (0, crypto_1.randomUUID)(),
        nome: 'Smartphone X',
        descricao: 'Um smartphone de última geração.',
        valor: 1500,
        dataCriacao: new Date('2024-01-01T10:00:00Z'),
        dataAtualizacao: new Date('2024-01-01T10:00:00Z'),
        ativo: true,
        dataExclusao: null
    };
    const mockProdutoData2 = {
        id: (0, crypto_1.randomUUID)(),
        nome: 'Capa Protetora',
        descricao: 'Capa para smartphone X.',
        valor: 50,
        dataCriacao: new Date('2024-01-01T10:00:00Z'),
        dataAtualizacao: new Date('2024-01-01T10:00:00Z'),
        ativo: true,
        dataExclusao: null
    };
    const produto1 = produto_entity_1.Produto.recuperar(mockProdutoData1);
    const produto2 = produto_entity_1.Produto.recuperar(mockProdutoData2);
    const baseProps = {
        pessoa: pessoa_entity_1.Pessoa.criar(mockPessoaData),
        cidade: 'São Paulo',
        vendedorResponsavel: 'Vendedor Alfa',
        produtos: [produto1, produto2],
    };
    // --- TESTES PARA O MÉTODO 'criarCliente' ---
    (0, vitest_1.it)('deve criar um novo cliente com dados completos e status ATIVO por padrão', () => {
        const cliente = cliente_entity_1.Cliente.criarCliente(baseProps);
        (0, vitest_1.expect)(cliente).toBeInstanceOf(cliente_entity_1.Cliente);
        (0, vitest_1.expect)(cliente.id).toBeDefined();
        (0, vitest_1.expect)(cliente.pessoa.nome).toBe(mockPessoaData.nome);
        (0, vitest_1.expect)(cliente.pessoa.telefone).toBe(mockPessoaData.telefone);
        (0, vitest_1.expect)(cliente.cidade).toBe(baseProps.cidade);
        (0, vitest_1.expect)(cliente.vendedorResponsavel).toBe(baseProps.vendedorResponsavel);
        (0, vitest_1.expect)(cliente.status).toBe(cliente_types_1.StatusCliente.ATIVO);
        (0, vitest_1.expect)(cliente.produtos).toHaveLength(2);
        (0, vitest_1.expect)(cliente.produtos[0]).toBeInstanceOf(produto_entity_1.Produto);
        (0, vitest_1.expect)(cliente.dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(cliente.dataAtualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(cliente.dataExclusao).toBeNull();
    });
    (0, vitest_1.it)('deve lançar erro se o cliente for criado sem telefone na Pessoa', () => {
        const propsSemTelefone = {
            ...baseProps,
            pessoa: pessoa_entity_1.Pessoa.criar({ ...mockPessoaData, telefone: null }),
        };
        (0, vitest_1.expect)(() => cliente_entity_1.Cliente.criarCliente(propsSemTelefone)).toThrowError(cliente_exception_1.ClienteExceptions.TelefoneObrigatorioParaClienteException);
    });
    (0, vitest_1.it)('deve lançar erro se o cliente for criado com telefone vazio na Pessoa', () => {
        const propsTelefoneVazio = {
            ...baseProps,
            pessoa: pessoa_entity_1.Pessoa.criar({ ...mockPessoaData, telefone: '' }),
        };
        (0, vitest_1.expect)(() => cliente_entity_1.Cliente.criarCliente(propsTelefoneVazio)).toThrowError(cliente_exception_1.ClienteExceptions.TelefoneObrigatorioParaClienteException);
    });
    (0, vitest_1.it)('deve lançar erro se o cliente for criado com nome de Pessoa vazio', () => {
        const propsNomePessoaVazio = {
            ...baseProps,
            pessoa: pessoa_entity_1.Pessoa.criar({ ...mockPessoaData, nome: '' }),
        };
        (0, vitest_1.expect)(() => cliente_entity_1.Cliente.criarCliente(propsNomePessoaVazio)).toThrowError("Nome é obrigatório para criar um Cliente.");
    });
    (0, vitest_1.it)('deve lançar erro se o cliente for criado com vendedor responsável vazio', () => {
        (0, vitest_1.expect)(() => cliente_entity_1.Cliente.criarCliente({ ...baseProps, vendedorResponsavel: ' ' })).toThrowError("Vendedor responsável é obrigatório.");
    });
    (0, vitest_1.it)('deve lançar erro se o cliente for criado com menos de 1 produto', () => {
        (0, vitest_1.expect)(() => cliente_entity_1.Cliente.criarCliente({ ...baseProps, produtos: [] })).toThrowError(cliente_exception_1.ClienteExceptions.QtdMinimaProdutosClienteInvalida);
    });
    // --- TESTES PARA MÉTODOS DE COMPORTAMENTO ---
    (0, vitest_1.it)('deve verificar se um cliente recém-criado não está deletado', () => {
        const clienteAtivo = cliente_entity_1.Cliente.criarCliente(baseProps);
        (0, vitest_1.expect)(clienteAtivo.estaDeletado()).toBe(false);
        (0, vitest_1.expect)(clienteAtivo.dataExclusao).toBeNull();
    });
    (0, vitest_1.it)('deve inativar um cliente ativo com sucesso', () => {
        const clienteAtivo = cliente_entity_1.Cliente.criarCliente(baseProps);
        (0, vitest_1.expect)(clienteAtivo.status).toBe(cliente_types_1.StatusCliente.ATIVO);
        (0, vitest_1.expect)(clienteAtivo.dataExclusao).toBeNull();
        const oldUpdateDate = clienteAtivo.dataAtualizacao;
        vitest_1.vi.advanceTimersByTime(100);
        clienteAtivo.inativar();
        (0, vitest_1.expect)(clienteAtivo.status).toBe(cliente_types_1.StatusCliente.INATIVO);
        (0, vitest_1.expect)(clienteAtivo.dataExclusao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(clienteAtivo.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
        (0, vitest_1.expect)(clienteAtivo.estaDeletado()).toBe(true);
    });
    (0, vitest_1.it)('não deve inativar um cliente que já está inativo', () => {
        const clienteAtivo = cliente_entity_1.Cliente.criarCliente(baseProps);
        clienteAtivo.inativar(); // Inativa pela primeira vez
        (0, vitest_1.expect)(() => clienteAtivo.inativar()).toThrowError(new cliente_exception_1.ClienteExceptions.ClienteJaInativo(clienteAtivo.id));
    });
    // --- TESTES PARA O MÉTODO 'recuperar' ---
    (0, vitest_1.it)('deve recuperar um cliente existente corretamente', () => {
        const recuperacaoProps = {
            id: (0, crypto_1.randomUUID)(),
            pessoa: pessoa_entity_1.Pessoa.recuperar({ id: (0, crypto_1.randomUUID)(), nome: 'Ana Costa', telefone: '22987654321', email: null }),
            cidade: 'Rio de Janeiro',
            vendedorResponsavel: 'Vendedor Beta',
            status: cliente_types_1.StatusCliente.INATIVO,
            produtos: [produto1],
            dataCriacao: new Date('2024-01-01T00:00:00Z'),
            dataAtualizacao: new Date('2024-01-01T00:00:00Z'),
            dataExclusao: new Date('2024-02-01T00:00:00Z'),
        };
        const cliente = cliente_entity_1.Cliente.recuperar(recuperacaoProps);
        (0, vitest_1.expect)(cliente).toBeInstanceOf(cliente_entity_1.Cliente);
        (0, vitest_1.expect)(cliente.id).toBe(recuperacaoProps.id);
        (0, vitest_1.expect)(cliente.pessoa.nome).toBe('Ana Costa');
        (0, vitest_1.expect)(cliente.status).toBe(cliente_types_1.StatusCliente.INATIVO);
        (0, vitest_1.expect)(cliente.dataExclusao).toEqual(recuperacaoProps.dataExclusao);
        (0, vitest_1.expect)(cliente.produtos).toHaveLength(1);
        (0, vitest_1.expect)(cliente.produtos[0]).toBeInstanceOf(produto_entity_1.Produto);
    });
    (0, vitest_1.it)('deve recuperar os dados essenciais do cliente', () => {
        const cliente = cliente_entity_1.Cliente.criarCliente(baseProps);
        const dadosEssenciais = cliente.recuperarDadosEssenciais();
        (0, vitest_1.expect)(dadosEssenciais.nome).toBe(cliente.pessoa.nome);
        (0, vitest_1.expect)(dadosEssenciais.email).toBe(cliente.pessoa.email);
        (0, vitest_1.expect)(dadosEssenciais.telefone).toBe(cliente.pessoa.telefone);
        (0, vitest_1.expect)(dadosEssenciais.vendedorResponsavel).toBe(cliente.vendedorResponsavel);
        (0, vitest_1.expect)(dadosEssenciais.produtos).toHaveLength(2);
    });
});
//# sourceMappingURL=cliente.entity.spec.js.map