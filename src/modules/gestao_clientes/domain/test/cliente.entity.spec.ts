import { Produto } from '@modules/produtos/domain/produto.entity';
import { IProduto } from '@modules/produtos/domain/produto.types';
import { randomUUID } from 'crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cliente } from '../cliente.entity';
import { ClienteExceptions } from '../cliente.exception';
import { CriarClienteProps, RecuperarClienteProps, StatusCliente } from '../cliente.types';

describe('Entidade Cliente (Domain Tests)', () => {
  // --- Mocks e Setup ---
  beforeEach(() => {
    vi.useFakeTimers();
  });

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
    dataExclusao: null,
    empresaId: randomUUID(),
  };

  const mockProdutoData2: IProduto = {
    id: randomUUID(),
    nome: 'Capa Protetora',
    descricao: 'Capa para smartphone X.',
    valor: 50,
    dataCriacao: new Date('2024-01-01T10:00:00Z'),
    dataAtualizacao: new Date('2024-01-01T10:00:00Z'),
    ativo: true,
    dataExclusao: null,
    empresaId: randomUUID(),
  };

  const produto1 = Produto.recuperar(mockProdutoData1);
  const produto2 = Produto.recuperar(mockProdutoData2);

  const baseProps: CriarClienteProps = {
    nome: mockPessoaData.nome,
    email: mockPessoaData.email,
    telefone: mockPessoaData.telefone,
    cidade: 'São Paulo',
    empresaId: randomUUID(),
  };

  // =================================================================
  // TESTES DE CRIAÇÃO
  // =================================================================

  it('deve criar um novo cliente com dados completos e status ATIVO por padrão', () => {
    const cliente = Cliente.criarCliente(baseProps);

    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.id).toBeDefined();
    expect(cliente.nome).toBe(mockPessoaData.nome);
    expect(cliente.telefone).toBe(mockPessoaData.telefone);
    expect(cliente.cidade).toBe(baseProps.cidade);
    expect(cliente.status).toBe(StatusCliente.ATIVO);
    expect(cliente.dataCriacao).toBeInstanceOf(Date);
    expect(cliente.dataAtualizacao).toBeInstanceOf(Date);
    expect(cliente.dataExclusao).toBeNull();
  });


  it('deve lançar erro se o cliente for criado com telefone vazio na Pessoa', () => {
    const propsTelefoneVazio = {
      ...baseProps,
      telefone: '',
    };
    expect(() => Cliente.criarCliente(propsTelefoneVazio)).toThrowError(
      ClienteExceptions.TelefoneObrigatorioParaClienteException,
    );
  });

  it('deve lançar erro se o cliente for criado com nome de Pessoa vazio', () => {
    const propsNomePessoaVazio = {
      ...baseProps,
      nome: '',
    };
    expect(() => Cliente.criarCliente(propsNomePessoaVazio)).toThrowError(
      "Nome é obrigatório para criar um Cliente.",
    );
  });



  // =================================================================
  // TESTES DE LÓGICA DE NEGÓCIO
  // =================================================================

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
  });

  it('não deve inativar um cliente que já está inativo', () => {
    const clienteAtivo = Cliente.criarCliente(baseProps);
    clienteAtivo.inativar();

    expect(() => clienteAtivo.inativar()).toThrowError(
      ClienteExceptions.ClienteJaInativo,
    );
  });

  // =================================================================
  // TESTES PARA O MÉTODO 'recuperar' (fromPersistence)
  // =================================================================
  it('deve recuperar um cliente existente corretamente', () => {
    const recuperacaoProps: RecuperarClienteProps = {
      id: randomUUID(),
      nome: 'Ana Costa',
      telefone: '22987654321',
      email: null,
      cidade: 'Rio de Janeiro',
      status: StatusCliente.INATIVO,
      dataCriacao: new Date('2024-01-01T00:00:00Z'),
      dataAtualizacao: new Date('2024-01-01T00:00:00Z'),
      dataExclusao: new Date('2024-02-01T00:00:00Z'),
      empresaId: randomUUID()
    };
    const cliente = Cliente.recuperar(recuperacaoProps);

    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.id).toBe(recuperacaoProps.id);
    expect(cliente.nome).toBe('Ana Costa');
    expect(cliente.status).toBe(StatusCliente.INATIVO);
    expect(cliente.dataExclusao).toEqual(recuperacaoProps.dataExclusao);
  });

  it('deve recuperar os dados essenciais do cliente', () => {
    const cliente = Cliente.criarCliente(baseProps);
    const dadosEssenciais = cliente.recuperarDadosEssenciais();

    expect(dadosEssenciais.nome).toBe(cliente.nome);
    expect(dadosEssenciais.email).toBe(cliente.email);
    expect(dadosEssenciais.telefone).toBe(cliente.telefone);
  });
});