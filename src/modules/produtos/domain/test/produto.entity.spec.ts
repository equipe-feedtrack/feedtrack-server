import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { Produto } from '../produto.entity'; // Ajuste o caminho
import { ProdutoExceptions } from '../produto.exception'; // Suas exceções de produto
import { CriarProdutoProps, RecuperarProdutoProps } from '../produto.types';
import { randomUUID } from 'crypto'; // Para IDs

describe('Entidade Produto', () => {
  // Configuração para controlar o tempo em testes de data
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Mocks de dados base para Produto
  const baseProps: CriarProdutoProps = {
    nome: 'Notebook Gamer Xtreme',
    descricao: 'Um notebook de alta performance para jogos e trabalho.',
    valor: 7500.00,
  };

  // --- Testes para o método 'criarProduto' ---
  it('deve criar um novo produto com dados completos e status ATIVO por padrão', () => {
    const produto = Produto.criarProduto(baseProps);

    expect(produto).toBeInstanceOf(Produto);
    expect(produto.id).toBeDefined();
    expect(produto.nome).toBe(baseProps.nome);
    expect(produto.descricao).toBe(baseProps.descricao);
    expect(produto.valor).toBe(baseProps.valor);
    expect(produto.ativo).toBe(true); // Padrão
    expect(produto.dataCriacao).toBeInstanceOf(Date);
    expect(produto.dataAtualizacao).toBeInstanceOf(Date);
    expect(produto.dataExclusao).toBeNull();
  });

  it('deve criar um produto com status INATIVO se especificado', () => {
    const produto = Produto.criarProduto({ ...baseProps });
    expect(produto.ativo).toBe(true); // Ativo no sentido de existir, não de status do produto
  });

  it('deve lançar erro se o nome do produto for muito curto', () => {
    expect(() => Produto.criarProduto({ ...baseProps, nome: 'Mini' })).toThrowError(
      ProdutoExceptions.NomeProdutoTamanhoMinimoInvalido,
    );
  });

  it('deve lançar erro se o nome do produto for muito longo', () => {
    expect(() => Produto.criarProduto({ ...baseProps, nome: 'a'.repeat(51) })).toThrowError(
      ProdutoExceptions.NomeProdutoTamanhoMaximoInvalido,
    );
  });

  it('deve lançar erro se a descrição do produto for muito curta', () => {
    expect(() => Produto.criarProduto({ ...baseProps, descricao: 'Curta' })).toThrowError(
      ProdutoExceptions.DescricaoProdutoTamanhoMinimoInvalido,
    );
  });

  it('deve lançar erro se a descrição do produto for muito longa', () => {
    expect(() => Produto.criarProduto({ ...baseProps, descricao: 'a'.repeat(201) })).toThrowError(
      ProdutoExceptions.DescricaoProdutoTamanhoMaximoInvalido,
    );
  });

  it('deve lançar erro se o valor do produto for negativo', () => {
    expect(() => Produto.criarProduto({ ...baseProps, valor: -10 })).toThrowError(
      ProdutoExceptions.ValorMinimoProdutoInvalido,
    );
  });

  // --- Testes para o método 'recuperar' ---
  it('deve recuperar um produto existente corretamente', () => {
    const recuperacaoProps: RecuperarProdutoProps = {
      id: randomUUID(),
      nome: 'Mouse Sem Fio',
      descricao: 'Mouse ergonômico para maior conforto.',
      valor: 150.00,
      dataCriacao: new Date('2024-01-01T00:00:00Z'),
      dataAtualizacao: new Date('2024-01-01T00:00:00Z'),
      dataExclusao: new Date('2024-02-01T00:00:00Z'), // Excluído logicamente
      ativo: false, // Inativo
    };

    const produto = Produto.recuperar(recuperacaoProps);

    expect(produto).toBeInstanceOf(Produto);
    expect(produto.id).toBe(recuperacaoProps.id);
    expect(produto.nome).toBe(recuperacaoProps.nome);
    expect(produto.descricao).toBe(recuperacaoProps.descricao);
    expect(produto.valor).toBe(recuperacaoProps.valor);
    expect(produto.ativo).toBe(false);
    expect(produto.dataExclusao).toEqual(recuperacaoProps.dataExclusao);
  });

  it('deve verificar se o produto está deletado corretamente', () => {
    const produtoAtivo = Produto.criarProduto(baseProps);
    expect(produtoAtivo.estaDeletado()).toBe(false);

    const produtoDeletado = Produto.recuperar({
      ...baseProps,
      id: randomUUID(),
      dataExclusao: new Date(),
      ativo: false,
      dataCriacao: new Date(), // Necessário para RecuperarProdutoProps
      dataAtualizacao: new Date(), // Necessário para RecuperarProdutoProps
    });
    expect(produtoDeletado.estaDeletado()).toBe(true);
  });
});