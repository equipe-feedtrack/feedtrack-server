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
      prisma.envio_formulario.deleteMany({}),
      prisma.produto.deleteMany({}),
      prisma.cliente.deleteMany({}),
    ]);

    CLIENTE_ID_PRODUTO_TESTE = randomUUID();
    await prisma.cliente.create({
      data: {
        id: CLIENTE_ID_PRODUTO_TESTE,
        nome: 'Cliente Produto Teste',
        email: 'produtoteste@example.com',
        telefone: '11912345678',
        cidade: 'Cidade Teste',
        status: 'ATIVO' as any,
        vendedor_responsavel: 'Vendedor Produtos',
        data_criacao: new Date(),
        data_atualizacao: new Date(),
        data_exclusao: null,
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
      cliente_id: CLIENTE_ID_PRODUTO_TESTE, // Vinculado a um cliente existente
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
    expect(produtoSalvo?.cliente_id).toBe(produto.cliente_id);
    expect(produtoSalvo?.data_criacao).toBeInstanceOf(Date);
    expect(produtoSalvo?.data_atualizacao).toBeInstanceOf(Date);
    expect(produtoSalvo?.data_exclusao).toBeNull();
  });

  // --- Testes para o método 'recuperarPorUuid' ---
  it('deve recuperar um produto existente por ID', async () => {
    const produto = Produto.criarProduto({
      nome: 'Monitor UltraWide',
      descricao: 'Monitor de 34 polegadas para produtividade.',
      valor: 2000.00,
      cliente_id: CLIENTE_ID_PRODUTO_TESTE,
    });
    await repository.inserir(produto);

    const produtoRecuperado = await repository.recuperarPorUuid(produto.id);

    expect(produtoRecuperado).toBeInstanceOf(Produto);
    expect(produtoRecuperado?.id).toBe(produto.id);
    expect(produtoRecuperado?.nome).toBe(produto.nome);
    expect(produtoRecuperado?.valor).toBe(produto.valor);
    expect(produtoRecuperado?.cliente_id).toBe(produto.cliente_id);
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
      cliente_id: CLIENTE_ID_PRODUTO_TESTE,
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
      cliente_id: produtoOriginal.cliente_id, // Copia do original
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
    expect(produtoAtualizado?.data_atualizacao.getTime()).toBe(dataAtualizacaoEsperada.getTime());
    expect(produtoAtualizado?.nome).toBe(produtoOriginal.nome);
    expect(produtoAtualizado?.cliente_id).toBe(produtoOriginal.cliente_id);
  });

  it('deve atualizar o status de um produto para INATIVO', async () => {
    const produtoAtivo = Produto.criarProduto({
      nome: 'Tablet Básico',
      descricao: 'Tablet para uso diário.',
      valor: 800.00,
      cliente_id: CLIENTE_ID_PRODUTO_TESTE,
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
      cliente_id: produtoAtivo.cliente_id,
    };
    const produtoInativado = Produto.recuperar(produtoInativadoProps); // Recria a entidade com as modificações

    await repository.atualizar(produtoInativado);

    const produtoAtualizadoNoDb = await prisma.produto.findUnique({
      where: { id: produtoInativado.id },
    });

    expect(produtoAtualizadoNoDb?.ativo).toBe(false);
    expect(produtoAtualizadoNoDb?.data_exclusao).toBeInstanceOf(Date);
  });


  // ... (Você pode adicionar mais testes para listar, existe, deletar conforme implementar)
});