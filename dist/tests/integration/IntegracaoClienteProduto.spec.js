"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const prisma = new client_1.PrismaClient();
(0, vitest_1.describe)('Testes Prisma - Clientes e Produtos', () => {
    (0, vitest_1.beforeEach)(async () => {
        await prisma.envioFormulario.deleteMany();
        await prisma.clientesOnProdutos.deleteMany();
        await prisma.produto.deleteMany();
        await prisma.cliente.deleteMany();
    });
    (0, vitest_1.it)('Deve criar um Cliente', async () => {
        const cliente = await prisma.cliente.create({
            data: {
                nome: 'Alexsandro',
                telefone: '99999-9999',
                email: 'alexsandro@email.com',
                cidade: 'Tobias Barreto',
                status: 'ATIVO',
                vendedorResponsavel: 'João',
            },
        });
        (0, vitest_1.expect)(cliente).toHaveProperty('id');
        (0, vitest_1.expect)(cliente.nome).toBe('Alexsandro');
        (0, vitest_1.expect)(cliente.email).toBe('alexsandro@email.com');
    });
    (0, vitest_1.it)('Deve criar um Produto associado a um Cliente', async () => {
        const cliente = await prisma.cliente.create({
            data: {
                nome: 'Alexsandro',
                telefone: '99999-9999',
                email: 'alexsandro@email.com',
                cidade: 'Tobias Barreto',
                status: 'ATIVO',
                vendedorResponsavel: 'João',
            },
        });
        const produto = await prisma.produto.create({
            data: {
                nome: 'Produto Teste',
                descricao: 'Descrição do produto',
                valor: 199.99,
                ativo: true,
                clientes: {
                    create: [
                        { cliente: { connect: { id: cliente.id } } }
                    ]
                }
            },
        });
        (0, vitest_1.expect)(produto).toHaveProperty('id');
        (0, vitest_1.expect)(produto.nome).toBe('Produto Teste');
    });
    (0, vitest_1.it)('Deve buscar um Cliente específico', async () => {
        const cliente = await prisma.cliente.create({
            data: {
                nome: 'Alexsandro',
                telefone: '99999-9999',
                email: 'alexsandro@email.com',
                cidade: 'Tobias Barreto',
                status: 'ATIVO',
                vendedorResponsavel: 'João',
            },
        });
        const clienteBuscado = await prisma.cliente.findUnique({
            where: { id: cliente.id },
        });
        (0, vitest_1.expect)(clienteBuscado).not.toBeNull();
        (0, vitest_1.expect)(clienteBuscado?.id).toBe(cliente.id);
    });
    (0, vitest_1.it)('Deve atualizar um Cliente existente', async () => {
        const cliente = await prisma.cliente.create({
            data: {
                nome: 'Alexsandro',
                telefone: '99999-9999',
                email: 'alexsandro@email.com',
                cidade: 'Tobias Barreto',
                status: 'ATIVO',
                vendedorResponsavel: 'João',
            },
        });
        const clienteAtualizado = await prisma.cliente.update({
            where: { id: cliente.id },
            data: { nome: 'Alex Atualizado', cidade: 'Aracaju' },
        });
        (0, vitest_1.expect)(clienteAtualizado.nome).toBe('Alex Atualizado');
        (0, vitest_1.expect)(clienteAtualizado.cidade).toBe('Aracaju');
    });
    (0, vitest_1.it)('Deve excluir um Cliente', async () => {
        const cliente = await prisma.cliente.create({
            data: {
                nome: 'Alexsandro',
                telefone: '99999-9999',
                email: 'alexsandro@email.com',
                cidade: 'Tobias Barreto',
                status: 'ATIVO',
                vendedorResponsavel: 'João',
            },
        });
        const clienteExcluido = await prisma.cliente.delete({
            where: { id: cliente.id },
        });
        const clienteBuscado = await prisma.cliente.findUnique({
            where: { id: cliente.id },
        });
        (0, vitest_1.expect)(clienteExcluido).toHaveProperty('id');
        (0, vitest_1.expect)(clienteBuscado).toBeNull();
    });
    (0, vitest_1.it)('Deve buscar todos os Clientes cadastrados', async () => {
        await prisma.cliente.createMany({
            data: [
                { nome: 'Cliente 1', telefone: '11111-1111', email: 'cliente1@email.com', cidade: 'Aracaju', status: 'ATIVO', vendedorResponsavel: 'João' },
                { nome: 'Cliente 2', telefone: '22222-2222', email: 'cliente2@email.com', cidade: 'São Paulo', status: 'INATIVO', vendedorResponsavel: 'Maria' },
            ],
        });
        const clientes = await prisma.cliente.findMany();
        (0, vitest_1.expect)(clientes.length).toBeGreaterThanOrEqual(2);
    });
});
//# sourceMappingURL=IntegracaoClienteProduto.spec.js.map