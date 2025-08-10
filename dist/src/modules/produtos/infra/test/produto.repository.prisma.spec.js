"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const produto_repository_prisma_1 = require("../produto.repository.prisma"); // Ajuste o caminho
const crypto_1 = require("crypto");
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
const prisma = new client_1.PrismaClient();
const repository = new produto_repository_prisma_1.ProdutoRepositoryPrisma(prisma);
(0, vitest_1.describe)('ProdutoRepositoryPrisma (Integration Tests)', () => {
    // Para testes de Produto, precisamos de um Cliente no DB para a FK cliente_id
    let CLIENTE_ID_PRODUTO_TESTE;
    (0, vitest_1.beforeEach)(async () => {
        await prisma.$transaction([
            prisma.clientesOnProdutos.deleteMany({}),
            prisma.envioFormulario.deleteMany({}),
            prisma.produto.deleteMany({}),
            prisma.cliente.deleteMany({}),
        ]);
        CLIENTE_ID_PRODUTO_TESTE = (0, crypto_1.randomUUID)();
        await prisma.cliente.create({
            data: {
                id: CLIENTE_ID_PRODUTO_TESTE,
                nome: 'Cliente Produto Teste',
                email: 'produtoteste@example.com',
                telefone: '11912345678',
                cidade: 'Cidade Teste',
                status: 'ATIVO',
                vendedorResponsavel: 'Vendedor Produtos',
                dataCriacao: new Date(),
                dataAtualizacao: new Date(),
                dataExclusao: null,
            },
        });
    });
    (0, vitest_1.afterAll)(async () => {
        await prisma.$disconnect();
    });
    // --- Testes para o método 'inserir' ---
    (0, vitest_1.it)('deve inserir um novo produto completo com sucesso', async () => {
        const produto = produto_entity_1.Produto.criarProduto({
            nome: 'Câmera Mirrorless',
            descricao: 'Câmera digital avançada com lentes intercambiáveis.',
            valor: 4500.00,
        });
        await repository.inserir(produto);
        const produtoSalvo = await prisma.produto.findUnique({
            where: { id: produto.id },
        });
        (0, vitest_1.expect)(produtoSalvo).toBeDefined();
        (0, vitest_1.expect)(produtoSalvo?.id).toBe(produto.id);
        (0, vitest_1.expect)(produtoSalvo?.nome).toBe(produto.nome);
        (0, vitest_1.expect)(produtoSalvo?.descricao).toBe(produto.descricao);
        (0, vitest_1.expect)(produtoSalvo?.valor).toBe(produto.valor);
        (0, vitest_1.expect)(produtoSalvo?.ativo).toBe(true);
        (0, vitest_1.expect)(produtoSalvo?.dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(produtoSalvo?.dataAtualizacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(produtoSalvo?.dataExclusao).toBeNull();
    });
    // --- Testes para o método 'recuperarPorUuid' ---
    (0, vitest_1.it)('deve recuperar um produto existente por ID', async () => {
        const produto = produto_entity_1.Produto.criarProduto({
            nome: 'Monitor UltraWide',
            descricao: 'Monitor de 34 polegadas para produtividade.',
            valor: 2000.00,
        });
        await repository.inserir(produto);
        const produtoRecuperado = await repository.recuperarPorUuid(produto.id);
        (0, vitest_1.expect)(produtoRecuperado).toBeInstanceOf(produto_entity_1.Produto);
        (0, vitest_1.expect)(produtoRecuperado?.id).toBe(produto.id);
        (0, vitest_1.expect)(produtoRecuperado?.nome).toBe(produto.nome);
        (0, vitest_1.expect)(produtoRecuperado?.valor).toBe(produto.valor);
    });
    (0, vitest_1.it)('deve retornar null se o produto não for encontrado por ID', async () => {
        const produtoRecuperado = await repository.recuperarPorUuid('id-inexistente');
        (0, vitest_1.expect)(produtoRecuperado).toBeNull();
    });
    // --- Testes para o método 'atualizar' ---
    (0, vitest_1.it)('deve atualizar os dados de um produto existente', async () => {
        const produtoOriginal = produto_entity_1.Produto.criarProduto({
            nome: 'Software de Edição',
            descricao: 'Licença anual de software.',
            valor: 500.00,
        });
        await repository.inserir(produtoOriginal);
        // Modifica a entidade de domínio
        const novoValor = 550.00;
        const novaDescricao = 'Licença anual de software, versão 2.0.';
        vitest_1.vi.setSystemTime(new Date(Date.now() + 1000)); // Avança o tempo para dataAtualizacao
        const dataAtualizacaoEsperada = new Date('2024-01-01T10:00:00Z'); // Captura a nova data
        // --- CORREÇÃO AQUI: Crie um novo objeto IProduto COMPLETO para passar para Produto.recuperar ---
        const produtoPropsModificado = {
            id: produtoOriginal.id, // O ID é obrigatório e vem do original
            nome: produtoOriginal.nome, // Copia do original
            descricao: novaDescricao, // Aplica a nova descrição
            valor: novoValor, // Aplica o novo valor
            dataCriacao: produtoOriginal.dataCriacao, // Copia do original
            dataAtualizacao: dataAtualizacaoEsperada, // Aplica a nova data de atualização
            dataExclusao: produtoOriginal.dataExclusao, // Copia do original
            ativo: produtoOriginal.ativo, // Copia do original
        };
        const produtoModificado = produto_entity_1.Produto.recuperar(produtoPropsModificado); // Agora o tipo é correto!
        // --- FIM DA CORREÇÃO ---
        await repository.atualizar(produtoModificado); // Chama o método de atualização
        const produtoAtualizado = await prisma.produto.findUnique({
            where: { id: produtoOriginal.id },
        });
        (0, vitest_1.expect)(produtoAtualizado).toBeDefined();
        (0, vitest_1.expect)(produtoAtualizado?.valor).toBe(novoValor);
        (0, vitest_1.expect)(produtoAtualizado?.descricao).toBe(novaDescricao);
        (0, vitest_1.expect)(produtoAtualizado?.dataAtualizacao.getTime()).toBe(dataAtualizacaoEsperada.getTime());
        (0, vitest_1.expect)(produtoAtualizado?.nome).toBe(produtoOriginal.nome);
    });
    (0, vitest_1.it)('deve atualizar o status de um produto para INATIVO', async () => {
        const produtoAtivo = produto_entity_1.Produto.criarProduto({
            nome: 'Tablet Básico',
            descricao: 'Tablet para uso diário.',
            valor: 800.00,
        });
        await repository.inserir(produtoAtivo);
        // Crie um novo objeto IProduto COMPLETO para passar para Produto.recuperar
        const produtoInativadoProps = {
            id: produtoAtivo.id,
            nome: produtoAtivo.nome,
            descricao: produtoAtivo.descricao,
            valor: produtoAtivo.valor,
            dataCriacao: produtoAtivo.dataCriacao,
            dataAtualizacao: new Date(Date.now() + 1000), // Nova data de atualização
            dataExclusao: new Date(), // Simula exclusão lógica
            ativo: false,
        };
        const produtoInativado = produto_entity_1.Produto.recuperar(produtoInativadoProps); // Recria a entidade com as modificações
        await repository.atualizar(produtoInativado);
        const produtoAtualizadoNoDb = await prisma.produto.findUnique({
            where: { id: produtoInativado.id },
        });
        (0, vitest_1.expect)(produtoAtualizadoNoDb?.ativo).toBe(false);
        (0, vitest_1.expect)(produtoAtualizadoNoDb?.dataExclusao).toBeInstanceOf(Date);
    });
    // ... (Você pode adicionar mais testes para listar, existe, deletar conforme implementar)
});
//# sourceMappingURL=produto.repository.prisma.spec.js.map