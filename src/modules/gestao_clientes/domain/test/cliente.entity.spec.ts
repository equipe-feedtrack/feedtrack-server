// src/modules/gestao_clientes/domain/test/cliente.entity.spec.ts

import { randomUUID } from 'crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Pessoa } from '@shared/domain/pessoa.entity';
import { Cliente } from '../cliente.entity';
import { ClienteExceptions } from '../cliente.exception';
import { CriarClienteProps, RecuperarClienteProps, StatusCliente } from '../cliente.types';
import { IProduto } from '@modules/produtos/domain/produto.types';
import { Produto } from '@modules/produtos/domain/produto.entity';

describe('Entidade Cliente', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- MOCKS DE DADOS ---
  const mockPessoaData = {
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    telefone: '11987654321',
  };

  const mockProdutoData1: IProduto = {
    id: randomUUID(),
    nome: 'Smartphone X',
    descricao: 'Um smartphone de última geração.',
    valor: 1500,
    dataCriacao: new Date('2024-01-01T10:00:00Z'),
    dataAtualizacao: new Date('2024-01-01T10:00:00Z'),
    ativo: true,
    cliente_id: randomUUID(),
    dataExclusao: null
  };

  const mockProdutoData2: IProduto = {
    id: randomUUID(),
    nome: 'Capa Protetora',
    descricao: 'Capa para smartphone X.',
    valor: 50,
    dataCriacao: new Date('2024-01-01T10:00:00Z'),
    dataAtualizacao: new Date('2024-01-01T10:00:00Z'),
    ativo: true,
    cliente_id: randomUUID(),
    dataExclusao: null
  };

  const produto1 = Produto.recuperar(mockProdutoData1);
  const produto2 = Produto.recuperar(mockProdutoData2);

  const baseProps: CriarClienteProps = {
    pessoa: Pessoa.criar(mockPessoaData),
    cidade: 'São Paulo',
    vendedorResponsavel: 'Vendedor Alfa',
    produtos: [produto1, produto2],
  };

  // --- TESTES PARA O MÉTODO 'criarCliente' ---
  it('deve criar um novo cliente com dados completos e status ATIVO por padrão', () => {
    const cliente = Cliente.criarCliente(baseProps);

    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.id).toBeDefined();
    expect(cliente.pessoa.nome).toBe(mockPessoaData.nome);
    expect(cliente.pessoa.telefone).toBe(mockPessoaData.telefone);
    expect(cliente.cidade).toBe(baseProps.cidade);
    expect(cliente.vendedorResponsavel).toBe(baseProps.vendedorResponsavel);
    expect(cliente.status).toBe(StatusCliente.ATIVO);
    expect(cliente.produtos).toHaveLength(2);
    expect(cliente.produtos[0]).toBeInstanceOf(Produto);
    expect(cliente.dataCriacao).toBeInstanceOf(Date);
    expect(cliente.dataAtualizacao).toBeInstanceOf(Date);
    expect(cliente.dataExclusao).toBeNull();
  });

  it('deve lançar erro se o cliente for criado sem telefone na Pessoa', () => {
    const propsSemTelefone = {
      ...baseProps,
      pessoa: Pessoa.criar({ ...mockPessoaData, telefone: null }),
    };
    expect(() => Cliente.criarCliente(propsSemTelefone)).toThrowError(
      ClienteExceptions.TelefoneObrigatorioParaClienteException,
    );
  });

  it('deve lançar erro se o cliente for criado com telefone vazio na Pessoa', () => {
    const propsTelefoneVazio = {
      ...baseProps,
      pessoa: Pessoa.criar({ ...mockPessoaData, telefone: '' }),
    };
    expect(() => Cliente.criarCliente(propsTelefoneVazio)).toThrowError(
      ClienteExceptions.TelefoneObrigatorioParaClienteException,
    );
  });

  it('deve lançar erro se o cliente for criado com nome de Pessoa vazio', () => {
    const propsNomePessoaVazio = {
      ...baseProps,
      pessoa: Pessoa.criar({ ...mockPessoaData, nome: '' }),
    };
    expect(() => Cliente.criarCliente(propsNomePessoaVazio)).toThrowError(
      "Nome é obrigatório para criar um Cliente.",
    );
  });

  it('deve lançar erro se o cliente for criado com vendedor responsável vazio', () => {
    expect(() => Cliente.criarCliente({ ...baseProps, vendedorResponsavel: ' ' })).toThrowError(
      "Vendedor responsável é obrigatório.",
    );
  });

  it('deve lançar erro se o cliente for criado com menos de 1 produto', () => {
    expect(() => Cliente.criarCliente({ ...baseProps, produtos: [] })).toThrowError(
      ClienteExceptions.QtdMinimaProdutosClienteInvalida,
    );
  });

  // --- TESTES PARA MÉTODOS DE COMPORTAMENTO ---
  it('deve verificar se um cliente recém-criado não está deletado', () => {
    const clienteAtivo = Cliente.criarCliente(baseProps);

    expect(clienteAtivo.estaDeletado()).toBe(false);
    expect(clienteAtivo.dataExclusao).toBeNull();
  });

  it('deve inativar um cliente ativo com sucesso', () => {
    const clienteAtivo = Cliente.criarCliente(baseProps);
    expect(clienteAtivo.status).toBe(StatusCliente.ATIVO);
    expect(clienteAtivo.dataExclusao).toBeNull();
    const oldUpdateDate = clienteAtivo.dataAtualizacao;

    vi.advanceTimersByTime(100);

    clienteAtivo.inativar();

    expect(clienteAtivo.status).toBe(StatusCliente.INATIVO);
    expect(clienteAtivo.dataExclusao).toBeInstanceOf(Date);
    expect(clienteAtivo.dataAtualizacao.getTime()).toBeGreaterThan(oldUpdateDate.getTime());
    expect(clienteAtivo.estaDeletado()).toBe(true);
  });

  it('não deve inativar um cliente que já está inativo', () => {
    const clienteAtivo = Cliente.criarCliente(baseProps);
    clienteAtivo.inativar(); // Inativa pela primeira vez

    expect(() => clienteAtivo.inativar()).toThrowError(
      new ClienteExceptions.ClienteJaInativo(clienteAtivo.id),
    );
  });

  // --- TESTES PARA O MÉTODO 'recuperar' ---
  it('deve recuperar um cliente existente corretamente', () => {
    const recuperacaoProps: RecuperarClienteProps = {
      id: randomUUID(),
      pessoa: Pessoa.recuperar({ id: randomUUID(), nome: 'Ana Costa', telefone: '22987654321', email: null }),
      cidade: 'Rio de Janeiro',
      vendedorResponsavel: 'Vendedor Beta',
      status: StatusCliente.INATIVO,
      produtos: [produto1],
      dataCriacao: new Date('2024-01-01T00:00:00Z'),
      dataAtualizacao: new Date('2024-01-01T00:00:00Z'),
      dataExclusao: new Date('2024-02-01T00:00:00Z'),
    };
    const cliente = Cliente.recuperar(recuperacaoProps);

    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.id).toBe(recuperacaoProps.id);
    expect(cliente.pessoa.nome).toBe('Ana Costa');
    expect(cliente.status).toBe(StatusCliente.INATIVO);
    expect(cliente.dataExclusao).toEqual(recuperacaoProps.dataExclusao);
    expect(cliente.produtos).toHaveLength(1);
    expect(cliente.produtos[0]).toBeInstanceOf(Produto);
  });

  it('deve recuperar os dados essenciais do cliente', () => {
    const cliente = Cliente.criarCliente(baseProps);
    const dadosEssenciais = cliente.recuperarDadosEssenciais();

    expect(dadosEssenciais.nome).toBe(cliente.pessoa.nome);
    expect(dadosEssenciais.email).toBe(cliente.pessoa.email);
    expect(dadosEssenciais.telefone).toBe(cliente.pessoa.telefone);
    expect(dadosEssenciais.vendedorResponsavel).toBe(cliente.vendedorResponsavel);
    expect(dadosEssenciais.produtos).toHaveLength(2);
  });
});