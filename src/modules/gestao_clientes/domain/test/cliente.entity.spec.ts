import { Produto } from '@modules/produtos/domain/produto.entity';
import { RecuperarProdutoProps } from '@modules/produtos/domain/produto.types';
import { Pessoa } from '@shared/domain/pessoa.entity'; // Sua entidade Pessoa
import { randomUUID } from 'crypto'; // Para IDs
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cliente } from '../cliente.entity'; // Ajuste o caminho
import { ClienteExceptions } from '../cliente.exception'; // Suas exceções de cliente
import { CriarClienteProps, RecuperarClienteProps, StatusCliente } from '../cliente.types';

describe('Entidade Cliente', () => {
  // Configuração para controlar o tempo em testes de data
  beforeEach(() => {
    vi.useFakeTimers(); 
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Mocks de dados base para Pessoa e Produto
  const mockPessoaData = {
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    telefone: '11987654321',
  };

  const mockPessoaComTelefoneVazio = {
    nome: 'Maria Souza',
    email: 'maria@example.com',
    telefone: '', // Telefone vazio
  };

  const mockProdutoData1 = {
    id: randomUUID(),
    nome: 'Smartphone X',
    descricao: 'Um smartphone de última geração.',
    valor: 1500,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    ativo: true,
    cliente_id: "89eebea5-2314-47bf-8510-e1ddf69503a9"
  };
  const mockProdutoData2 = {
    id: randomUUID(),
    nome: 'Capa Protetora',
    descricao: 'Capa para smartphone X.',
    valor: 50,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    ativo: true,
    cliente_id: "89eebea5-2314-47bf-8510-e1ddf69503a9"
  };

  // Instâncias de entidades Produto para usar nos mocks de Cliente
  const produto1 = Produto.recuperar(mockProdutoData1 as RecuperarProdutoProps); // Casting temporário, Produto.recuperar espera RecuperarProdutoProps
  const produto2 = Produto.recuperar(mockProdutoData2 as RecuperarProdutoProps);

  // Mocks de dados base para Cliente
  const baseProps: CriarClienteProps = {
    pessoa: Pessoa.criar(mockPessoaData), // Cria uma instância de Pessoa
    cidade: 'São Paulo',
    vendedorResponsavel: 'Vendedor Alfa',
    produtos: [produto1, produto2], // Lista de entidades Produto
  };


  // --- Testes para o método 'criarCliente' ---
  it('deve criar um novo cliente com dados completos e status ATIVO por padrão', () => {
    const cliente = Cliente.criarCliente(baseProps);

    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.id).toBeDefined();
    expect(cliente.pessoa.nome).toBe(mockPessoaData.nome);
    expect(cliente.pessoa.telefone).toBe(mockPessoaData.telefone);
    expect(cliente.cidade).toBe(baseProps.cidade);
    expect(cliente.vendedorResponsavel).toBe(baseProps.vendedorResponsavel);
    expect(cliente.status).toBe(StatusCliente.ATIVO); // Padrão
    expect(cliente.produtos).toHaveLength(2);
    expect(cliente.produtos[0]).toBeInstanceOf(Produto); // Garante que são entidades Produto
    expect(cliente.dataCriacao).toBeInstanceOf(Date);
    expect(cliente.dataAtualizacao).toBeInstanceOf(Date);
    expect(cliente.dataExclusao).toBeNull();
  });

  it('deve lançar erro se o cliente for criado sem telefone na Pessoa', () => {
    const propsSemTelefone = {
      ...baseProps,
      pessoa: Pessoa.criar({ ...mockPessoaData, telefone: undefined }), // Pessoa sem telefone
    };
    expect(() => Cliente.criarCliente(propsSemTelefone)).toThrowError(
      ClienteExceptions.TelefoneObrigatorioParaClienteException,
    );
  });

  it('deve lançar erro se o cliente for criado com telefone vazio na Pessoa', () => {
    const propsTelefoneVazio = {
      ...baseProps,
      pessoa: Pessoa.criar({ ...mockPessoaComTelefoneVazio, telefone: '' }), // Pessoa com telefone vazio
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
    expect(() => Cliente.criarCliente(propsNomePessoaVazio)).toThrowError("Nome é obrigatório.");
  });

  it('deve lançar erro se o cliente for criado com vendedor responsável vazio', () => {
    expect(() => Cliente.criarCliente({ ...baseProps, vendedorResponsavel: ' ' })).toThrowError(
      "Vendedor responsável é obrigatório." // Exceção do setter
    );
  });

  it('deve lançar erro se o cliente for criado com menos de 1 produto', () => {
    expect(() => Cliente.criarCliente({ ...baseProps, produtos: [] })).toThrowError(
      ClienteExceptions.QtdMinimaProdutosClienteInvalida,
    );
  });


  // --- Testes para o método 'recuperar' ---
  it('deve recuperar um cliente existente corretamente', () => {
    const recuperacaoProps: RecuperarClienteProps = {
      id: randomUUID(),
      pessoa: Pessoa.recuperar({ id: randomUUID(), nome: 'Ana Costa', telefone: '22987654321' }), // Entidade Pessoa recuperada
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

  // --- Testes para Métodos de Comportamento ---
  it('deve verificar se o cliente está deletado corretamente', () => {
    const clienteAtivo = Cliente.criarCliente(baseProps);
    expect(clienteAtivo.estaDeletado()).toBe(false);

    const clienteDeletado = Cliente.recuperar({ ...baseProps, id: randomUUID(), status: StatusCliente.INATIVO, dataExclusao: new Date(), pessoa: Pessoa.criar(mockPessoaData), dataCriacao: new Date(), dataAtualizacao: new Date(), produtos: [produto1] });
    expect(clienteDeletado.estaDeletado()).toBe(true);
  });

  it('deve recuperar os dados essenciais do cliente', () => {
    const cliente = Cliente.criarCliente(baseProps);
    const dadosEssenciais = cliente.recuperarDadosEssenciais();

    expect(dadosEssenciais.nome).toBe(cliente.pessoa.nome);
    expect(dadosEssenciais.email).toBe(cliente.pessoa.email);
    expect(dadosEssenciais.telefone).toBe(cliente.pessoa.telefone);
    expect(dadosEssenciais.vendedorResponsavel).toBe(cliente.vendedorResponsavel);
    expect(dadosEssenciais.produtos).toHaveLength(2); // Retorna as entidades Produto
  });
});