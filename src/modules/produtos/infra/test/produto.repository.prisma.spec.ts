import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll, vi } from 'vitest';
import { ProdutoRepositoryPrisma } from '../produto.repository.prisma'; // Ajuste o caminho
import { randomUUID } from 'crypto';
import { Produto } from '@modules/produtos/domain/produto.entity';
import { IProduto } from '@modules/produtos/domain/produto.types';

const prisma = new PrismaClient();
const repository = new ProdutoRepositoryPrisma(prisma);

describe('ProdutoRepositoryPrisma (Integration Tests)', () => {
  // Para testes de Produto, precisamos de um Cliente no DB para a FK cliente_id
  let CLIENTE_ID_PRODUTO_TESTE: string;

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.clientesOnProdutos.deleteMany({}),
      prisma.envioFormulario.deleteMany({}),
      prisma.produto.deleteMany({}),
      prisma.cliente.deleteMany({}),
      prisma.pessoa.deleteMany({}), // Clear Pessoa table
    ]);

    CLIENTE_ID_PRODUTO_TESTE = randomUUID();
    const pessoa = await prisma.pessoa.create({
      data: { id: randomUUID(), nome: 'Cliente Produto Teste Pessoa', email: 'produtoteste@example.com', telefone: '11912345678' },
    });
    await prisma.cliente.create({
      data: {
        id: CLIENTE_ID_PRODUTO_TESTE,
        nome: 'Cliente Produto Teste',
        cidade: 'Cidade Teste',
        status: 'ATIVO' as any,
        vendedorResponsavel: 'Vendedor Produtos',
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        dataExclusao: null,
        pessoaId: pessoa.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Testes para o método 'inserir' ---
  it('deve inserir um novo produto completo com sucesso', async () => {
    const produto = Produto.criarProduto({
      nome: 'Câmera Mirrorless',
      descricao: 'Câmera digital avançada com lentes intercambiáveis.',
      valor: 4500.00,
    });

    await repository.inserir(produto);

    const produtoSalvo = await prisma.produto.findUnique({
      where: { id: produto.id },
    });

    expect(produtoSalvo).toBeDefined();
    expect(produtoSalvo?.id).toBe(produto.id);
    expect(produtoSalvo?.nome).toBe(produto.nome);
    expect(produtoSalvo?.descricao).toBe(produto.descricao);
    expect(produtoSalvo?.valor).toBe(produto.valor);
    expect(produtoSalvo?.ativo).toBe(true);
    expect(produtoSalvo?.dataCriacao).toBeInstanceOf(Date);
    expect(produtoSalvo?.dataAtualizacao).toBeInstanceOf(Date);
    expect(produtoSalvo?.dataExclusao).toBeNull();
  });

  // --- Testes para o método 'recuperarPorUuid' ---
  it('deve recuperar um produto existente por ID', async () => {
    const produto = Produto.criarProduto({
      nome: 'Monitor UltraWide',
      descricao: 'Monitor de 34 polegadas para produtividade.',
      valor: 2000.00,
    });
    await repository.inserir(produto);

    const produtoRecuperado = await repository.recuperarPorUuid(produto.id);

    expect(produtoRecuperado).toBeInstanceOf(Produto);
    expect(produtoRecuperado?.id).toBe(produto.id);
    expect(produtoRecuperado?.nome).toBe(produto.nome);
    expect(produtoRecuperado?.valor).toBe(produto.valor);
  });

  it('deve retornar null se o produto não for encontrado por ID', async () => {
    const produtoRecuperado = await repository.recuperarPorUuid('id-inexistente');
    expect(produtoRecuperado).toBeNull();
  });

  // --- Testes para o método 'atualizar' ---
   it('deve atualizar os dados de um produto existente', async () => {
    const produtoOriginal = Produto.criarProduto({
      nome: 'Software de Edição',
      descricao: 'Licença anual de software.',
      valor: 500.00,
    });
    await repository.inserir(produtoOriginal);

    // Modifica a entidade de domínio
    const novoValor = 550.00;
    const novaDescricao = 'Licença anual de software, versão 2.0.';
    vi.setSystemTime(new Date(Date.now() + 1000)); // Avança o tempo para dataAtualizacao
    const dataAtualizacaoEsperada = new Date('2024-01-01T10:00:00Z'); // Captura a nova data

    // --- CORREÇÃO AQUI: Crie um novo objeto IProduto COMPLETO para passar para Produto.recuperar ---
    const produtoPropsModificado: IProduto = {
      id: produtoOriginal.id, // O ID é obrigatório e vem do original
      nome: produtoOriginal.nome, // Copia do original
      descricao: novaDescricao, // Aplica a nova descrição
      valor: novoValor, // Aplica o novo valor
      dataCriacao: produtoOriginal.dataCriacao, // Copia do original
      dataAtualizacao: dataAtualizacaoEsperada, // Aplica a nova data de atualização
      dataExclusao: produtoOriginal.dataExclusao, // Copia do original
      ativo: produtoOriginal.ativo, // Copia do original
    };
    const produtoModificado = Produto.recuperar(produtoPropsModificado); // Agora o tipo é correto!
    // --- FIM DA CORREÇÃO ---

    await repository.atualizar(produtoModificado); // Chama o método de atualização

    const produtoAtualizado = await prisma.produto.findUnique({
      where: { id: produtoOriginal.id },
    });

    expect(produtoAtualizado).toBeDefined();
    expect(produtoAtualizado?.valor).toBe(novoValor);
    expect(produtoAtualizado?.descricao).toBe(novaDescricao);
    expect(produtoAtualizado?.dataAtualizacao.getTime()).toBe(dataAtualizacaoEsperada.getTime());
    expect(produtoAtualizado?.nome).toBe(produtoOriginal.nome);
  });

  it('deve atualizar o status de um produto para INATIVO', async () => {
    const produtoAtivo = Produto.criarProduto({
      nome: 'Tablet Básico',
      descricao: 'Tablet para uso diário.',
      valor: 800.00,
    });
    await repository.inserir(produtoAtivo);

    // Crie um novo objeto IProduto COMPLETO para passar para Produto.recuperar
    const produtoInativadoProps: IProduto = {
      id: produtoAtivo.id,
      nome: produtoAtivo.nome,
      descricao: produtoAtivo.descricao,
      valor: produtoAtivo.valor,
      dataCriacao: produtoAtivo.dataCriacao,
      dataAtualizacao: new Date(Date.now() + 1000), // Nova data de atualização
      dataExclusao: new Date(), // Simula exclusão lógica
      ativo: false,
    };
    const produtoInativado = Produto.recuperar(produtoInativadoProps); // Recria a entidade com as modificações

    await repository.atualizar(produtoInativado);

    const produtoAtualizadoNoDb = await prisma.produto.findUnique({
      where: { id: produtoInativado.id },
    });

    expect(produtoAtualizadoNoDb?.ativo).toBe(false);
    expect(produtoAtualizadoNoDb?.dataExclusao).toBeInstanceOf(Date);
  });


  // ... (Você pode adicionar mais testes para listar, existe, deletar conforme implementar)
});