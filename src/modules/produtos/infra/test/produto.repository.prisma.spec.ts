import { PrismaClient, StatusEmpresa, Plano, StatusUsuario } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll, vi } from 'vitest';
import { randomUUID } from 'crypto';
import { Produto } from '@modules/produtos/domain/produto.entity';
import { ProdutoRepositoryPrisma } from '../produto.repository.prisma';

const prisma = new PrismaClient();
const repository = new ProdutoRepositoryPrisma(prisma);

describe('ProdutoRepositoryPrisma (Integration Tests)', () => {
    // =================================================================
    // IDs Fixos e Setup de Ambiente de Teste
    // =================================================================
    const PRODUTO_ID_1 = randomUUID();
    const PRODUTO_ID_2 = randomUUID();
    const EMPRESA_ID = randomUUID();

    beforeEach(async () => {
        // Limpeza do Banco de Dados antes de cada teste
        // A ordem de exclusão é crucial para evitar erros de chave estrangeira
        await prisma.venda.deleteMany({});
        await prisma.produto.deleteMany({});
        await prisma.cliente.deleteMany({});
        await prisma.empresa.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.funcionario.deleteMany({});
        await prisma.logAtividade.deleteMany({});
        await prisma.campanha.deleteMany({});
        await prisma.formulario.deleteMany({});
        await prisma.pergunta.deleteMany({});
        await prisma.feedback.deleteMany({});
        await prisma.envioFormulario.deleteMany({});

        // Setup: Criação da Empresa que será usada como Foreign Key
        await prisma.empresa.create({
            data: {
                id: EMPRESA_ID,
                nome: 'Empresa Teste',
                email: 'teste@empresa.com',
                cnpj: '12345678901234',
                plano: Plano.FREE,
                status: StatusEmpresa.ATIVO,
            },
        });
    });

    afterAll(async () => {
        // Limpeza final para evitar poluição do banco de dados de teste
        await prisma.venda.deleteMany({});
        await prisma.produto.deleteMany({});
        await prisma.cliente.deleteMany({});
        await prisma.empresa.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.funcionario.deleteMany({});
        await prisma.logAtividade.deleteMany({});
        await prisma.campanha.deleteMany({});
        await prisma.formulario.deleteMany({});
        await prisma.pergunta.deleteMany({});
        await prisma.feedback.deleteMany({});
        await prisma.envioFormulario.deleteMany({});
        await prisma.$disconnect();
    });

    // =================================================================
    // TESTES
    // =================================================================

    it('deve inserir um novo produto completo com sucesso', async () => {
        // 1. Cria a entidade de domínio
        const produto = Produto.criarProduto({
            nome: 'Câmera Mirrorless',
            descricao: 'Câmera digital avançada com lentes intercambiáveis.',
            valor: 4500.00,
            empresaId: EMPRESA_ID, // Usa o ID da empresa criada no setup
        });

        // 2. Salva a entidade no banco de dados
        await repository.inserir(produto);

        // 3. Verifica se o registro foi criado corretamente no DB
        const produtoSalvo = await prisma.produto.findUnique({
            where: { id: produto.id },
        });

        expect(produtoSalvo).toBeDefined();
        expect(produtoSalvo?.id).toBe(produto.id);
        expect(produtoSalvo?.nome).toBe(produto.nome);
        expect(produtoSalvo?.empresaId).toBe(EMPRESA_ID);
        expect(produtoSalvo?.ativo).toBe(true);
    });

    it('deve recuperar um produto existente por ID', async () => {
        // 1. Setup: Insere um produto diretamente no DB para o teste
        await prisma.produto.create({
            data: {
                id: PRODUTO_ID_2,
                nome: 'Monitor UltraWide',
                descricao: 'Monitor de 34 polegadas para produtividade.',
                valor: 2000.00,
                ativo: true,
                empresaId: EMPRESA_ID, // Usa o ID da empresa do setup
            },
        });

        // 2. Tenta recuperar o produto pelo repositório
        const produtoRecuperado = await repository.recuperarPorUuid(PRODUTO_ID_2);

        // 3. Verifica o resultado
        expect(produtoRecuperado).toBeInstanceOf(Produto);
        expect(produtoRecuperado?.id).toBe(PRODUTO_ID_2);
        expect(produtoRecuperado?.nome).toBe('Monitor UltraWide');
    });

    it('deve retornar null se o produto não for encontrado por ID', async () => {
        const produtoRecuperado = await repository.recuperarPorUuid('id-inexistente');
        expect(produtoRecuperado).toBeNull();
    });

    it('deve atualizar os dados de um produto existente', async () => {
        // 1. Setup: Insere um produto diretamente no DB
        const produtoDb = await prisma.produto.create({
            data: {
                id: PRODUTO_ID_1,
                nome: 'Software de Edição',
                descricao: 'Licença anual de software.',
                valor: 500.00,
                ativo: true,
                empresaId: EMPRESA_ID,
            },
        });

        // 2. Recupera a entidade e aplica a lógica de negócio
        const produtoEntidade = Produto.recuperar(produtoDb);
        produtoEntidade.atualizarDescricao('Licença anual, versão 2.0.');
        produtoEntidade.atualizarValor(550.00);

        // 3. Salva a entidade atualizada
        await repository.atualizar(produtoEntidade);

        // 4. Busca o registro atualizado do DB
        const produtoAtualizado = await prisma.produto.findUnique({
            where: { id: PRODUTO_ID_1 },
        });

        // 5. Verifica as mudanças
        expect(produtoAtualizado?.valor).toBe(550.00);
        expect(produtoAtualizado?.descricao).toBe('Licença anual, versão 2.0.');
    });

    it('deve atualizar o status de um produto para INATIVO', async () => {
        // 1. Setup: Insere um produto ativo
        const produtoDb = await prisma.produto.create({
            data: {
                id: PRODUTO_ID_2,
                nome: 'Tablet Básico',
                descricao: 'Tablet para uso diário.',
                valor: 800.00,
                ativo: true,
                empresaId: EMPRESA_ID,
            },
        });
        
        // 2. Recupera a entidade e a inativa
        const produtoEntidade = Produto.recuperar(produtoDb);
        produtoEntidade.inativar();

        // 3. Salva a entidade atualizada
        await repository.atualizar(produtoEntidade);

        // 4. Busca o registro atualizado do DB
        const produtoAtualizadoNoDb = await prisma.produto.findUnique({
            where: { id: produtoEntidade.id },
        });

        // 5. Verifica se o status e a data de exclusão foram atualizados
        expect(produtoAtualizadoNoDb?.ativo).toBe(false);
        expect(produtoAtualizadoNoDb?.dataExclusao).toBeInstanceOf(Date);
    });
});