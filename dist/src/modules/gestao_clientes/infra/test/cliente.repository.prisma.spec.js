"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const campanha_types_1 = require("@modules/campanha/domain/campanha.types");
const cliente_entity_1 = require("@modules/gestao_clientes/domain/cliente.entity");
const cliente_types_1 = require("@modules/gestao_clientes/domain/cliente.types");
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
const client_1 = require("@prisma/client");
const pessoa_entity_1 = require("@shared/domain/pessoa.entity");
const vitest_1 = require("vitest");
const cliente_repository_prisma_1 = require("../cliente.repository.prisma");
const prisma = new client_1.PrismaClient();
const repository = new cliente_repository_prisma_1.ClienteRepositoryPrisma(prisma);
(0, vitest_1.describe)('ClienteRepositoryPrisma (Integration Tests)', () => {
    // =================================================================
    // IDs e Datas Fixas para Testes Determinísticos
    // =================================================================
    const PRODUTO_ID_1 = 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5';
    const PRODUTO_ID_2 = 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
    const CLIENTE_ID_1 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const CLIENTE_ID_2 = '8c6b7e1a-4f5c-4a3b-8d9c-1e2f3a4b5c6d'; // Cliente antigo
    const CLIENTE_ID_3 = '7f4a2b9e-1c8d-4e5f-a9b0-8c7d6e5f4a3b'; // Cliente recente
    const dataReferencia = new Date('2025-08-03T15:00:00.000Z');
    vitest_1.vi.setSystemTime(dataReferencia);
    const dataAntiga = new Date('2023-01-01T10:00:00.000Z');
    const dataRecente = new Date();
    let produtoDb1;
    let produtoDb2;
    (0, vitest_1.beforeEach)(async () => {
        // 1. Limpeza do Banco ANTES DE CADA TESTE
        // A ordem importa: delete primeiro os registros da tabela de junção.
        await prisma.clientesOnProdutos.deleteMany({});
        await prisma.cliente.deleteMany({});
        await prisma.produto.deleteMany({});
        // 2. Criação dos Dados Base (Produtos)
        await prisma.produto.createMany({
            data: [
                { id: PRODUTO_ID_1, nome: 'Serviço Premium', descricao: 'Detalhada A', valor: 1000, ativo: true },
                { id: PRODUTO_ID_2, nome: 'Consultoria', descricao: 'Consultoria de 2 horas', valor: 500, ativo: true },
            ],
        });
        // 3. Criação dos Clientes e CONEXÃO das Relações
        await prisma.cliente.create({
            data: {
                id: CLIENTE_ID_1,
                nome: 'Cliente Ativo Teste', email: 'ativo@example.com', telefone: '11111111111',
                cidade: 'Cidade Teste', status: client_1.StatusUsuario.ATIVO, vendedorResponsavel: 'Vendedor Teste',
                dataCriacao: dataAntiga, dataAtualizacao: dataAntiga,
                produtos: {
                    create: [
                        { produto: { connect: { id: PRODUTO_ID_1 } } },
                        { produto: { connect: { id: PRODUTO_ID_2 } } },
                    ],
                },
            },
        });
        await prisma.cliente.create({
            data: {
                id: CLIENTE_ID_2,
                nome: 'Cliente Antigo', email: 'antigo@example.com', telefone: '22222222222',
                cidade: 'Cidade Antiga', status: client_1.StatusUsuario.ATIVO, vendedorResponsavel: 'Vendedor Antigo',
                dataCriacao: dataAntiga, dataAtualizacao: dataAntiga,
                produtos: { create: [{ produto: { connect: { id: PRODUTO_ID_1 } } }] },
            },
        });
        await prisma.cliente.create({
            data: {
                id: CLIENTE_ID_3,
                nome: 'Cliente Novo', email: 'novo@example.com', telefone: '33333333333',
                cidade: 'Cidade Nova', status: client_1.StatusUsuario.ATIVO, vendedorResponsavel: 'Vendedor Novo',
                dataCriacao: dataRecente, dataAtualizacao: dataRecente,
                produtos: { create: [{ produto: { connect: { id: PRODUTO_ID_1 } } }] },
            },
        });
        // 4. Recupera as entidades para usar nos testes
        const p1 = await prisma.produto.findUnique({ where: { id: PRODUTO_ID_1 } });
        const p2 = await prisma.produto.findUnique({ where: { id: PRODUTO_ID_2 } });
        if (p1 && p2) {
            produtoDb1 = produto_entity_1.Produto.recuperar(p1);
            produtoDb2 = produto_entity_1.Produto.recuperar(p2);
        }
    });
    (0, vitest_1.afterAll)(async () => {
        await prisma.clientesOnProdutos.deleteMany({});
        await prisma.cliente.deleteMany({});
        await prisma.produto.deleteMany({});
        await prisma.$disconnect();
    });
    // =================================================================
    // TESTES
    // =================================================================
    (0, vitest_1.it)('deve inserir um novo cliente e conectar produtos existentes', async () => {
        const novoCliente = cliente_entity_1.Cliente.criarCliente({
            pessoa: pessoa_entity_1.Pessoa.criar({ nome: 'Ana Costa', email: 'ana@example.com', telefone: '11987654321' }),
            cidade: 'Belo Horizonte',
            vendedorResponsavel: 'Vendedor Gama',
            produtos: [produtoDb1, produtoDb2],
        });
        await repository.inserir(novoCliente);
        const clienteSalvo = await prisma.cliente.findUnique({
            where: { id: novoCliente.id },
            include: { produtos: { include: { produto: true } } },
        });
        (0, vitest_1.expect)(clienteSalvo).toBeDefined();
        (0, vitest_1.expect)(clienteSalvo?.produtos).toHaveLength(2);
        (0, vitest_1.expect)(clienteSalvo?.produtos.some(item => item.produto.id === PRODUTO_ID_1)).toBe(true);
    });
    (0, vitest_1.it)('deve recuperar um cliente por ID, incluindo suas relações', async () => {
        const clienteRecuperado = await repository.recuperarPorUuid(CLIENTE_ID_1);
        (0, vitest_1.expect)(clienteRecuperado).toBeInstanceOf(cliente_entity_1.Cliente);
        (0, vitest_1.expect)(clienteRecuperado?.id).toBe(CLIENTE_ID_1);
        (0, vitest_1.expect)(clienteRecuperado?.pessoa.nome).toBe('Cliente Ativo Teste');
        (0, vitest_1.expect)(clienteRecuperado?.produtos).toHaveLength(2);
    });
    (0, vitest_1.it)('deve atualizar os dados de um cliente e sua lista de produtos', async () => {
        const clienteRecuperado = await repository.recuperarPorUuid(CLIENTE_ID_1);
        (0, vitest_1.expect)(clienteRecuperado).toBeDefined();
        clienteRecuperado.atualizarCidade('Nova Cidade');
        clienteRecuperado.removerProduto(produtoDb1); // Remove um produto
        await repository.atualizar(clienteRecuperado);
        const clienteDoDb = await prisma.cliente.findUnique({
            where: { id: CLIENTE_ID_1 },
            include: { produtos: { include: { produto: true } } },
        });
        (0, vitest_1.expect)(clienteDoDb?.cidade).toBe('Nova Cidade');
        (0, vitest_1.expect)(clienteDoDb?.produtos).toHaveLength(1);
        (0, vitest_1.expect)(clienteDoDb?.produtos[0].produto.id).toBe(PRODUTO_ID_2);
    });
    (0, vitest_1.it)('deve inativar um cliente e persistir a mudança', async () => {
        const clienteParaInativar = await repository.recuperarPorUuid(CLIENTE_ID_1);
        (0, vitest_1.expect)(clienteParaInativar?.status).toBe(cliente_types_1.StatusCliente.ATIVO);
        clienteParaInativar.inativar();
        await repository.atualizar(clienteParaInativar);
        const clienteDoDb = await prisma.cliente.findUnique({
            where: { id: CLIENTE_ID_1 },
        });
        (0, vitest_1.expect)(clienteDoDb?.status).toBe(client_1.StatusUsuario.INATIVO);
        (0, vitest_1.expect)(clienteDoDb?.dataExclusao).toBeInstanceOf(Date);
    });
    (0, vitest_1.it)('deve buscar clientes por segmento TODOS_CLIENTES e encontrar todos', async () => {
        const clientes = await repository.buscarPorSegmento(campanha_types_1.SegmentoAlvo.TODOS_CLIENTES);
        (0, vitest_1.expect)(clientes).toHaveLength(3);
    });
    (0, vitest_1.it)('deve buscar clientes por segmento NOVOS_CLIENTES e encontrar apenas o cliente recente', async () => {
        const clientes = await repository.buscarPorSegmento(campanha_types_1.SegmentoAlvo.NOVOS_CLIENTES);
        (0, vitest_1.expect)(clientes).toHaveLength(1);
        (0, vitest_1.expect)(clientes[0].id).toBe(CLIENTE_ID_3);
    });
});
//# sourceMappingURL=cliente.repository.prisma.spec.js.map