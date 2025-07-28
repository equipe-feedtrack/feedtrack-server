// src/modules/gestao_clientes/infra/database/orm/prisma/repositories/tests/cliente.repository.prisma.spec.ts

import { PrismaClient, Produto as ProdutoPrisma } from '@prisma/client';
import { beforeEach, describe, expect, it, afterAll, vi } from 'vitest';
import { ClienteRepositoryPrisma } from '../cliente.repository.prisma';
import { randomUUID } from 'crypto';
import { Pessoa } from '@shared/domain/pessoa.entity';
import { ProdutoMap } from '@modules/produtos/infra/mappers/produto.map';
import { SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { IProduto } from '@modules/produtos/domain/produto.types';
import { Produto as produtoEntity} from '@modules/produtos/domain/produto.entity';
import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { ICliente, StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';


const prisma = new PrismaClient();
const repository = new ClienteRepositoryPrisma(prisma);

describe('ClienteRepositoryPrisma (Integration Tests)', async () => {
  // IDs mockados
  const PRODUTO_ID_1 = randomUUID();
  const PRODUTO_ID_2 = randomUUID();
  const PRODUTO_ID_3 = randomUUID();

  let produtoDb1: produtoEntity;
  let produtoDb2: produtoEntity;
  let produtoDb3: produtoEntity;

  let CLIENTE_ID_PRODUTO_TESTE: string;


  beforeEach(async () => {
    // 1. Limpar na ordem inversa das dependências
    await prisma.$transaction([
      prisma.envio_formulario.deleteMany({}), // Se Envio_formulario referencia Cliente
      prisma.produto.deleteMany({}),
      prisma.cliente.deleteMany({}),
    ]);

    // 3. Preparar e inserir os produtos no banco de dados, SEM VINCULAR AO CLIENTE
    // Eles existem de forma independente, prontos para serem 'connected'.
    // O 'cliente_id' é definido como null aqui, permitindo que sejam criados "desvinculados".
    const mockProdutoData1: IProduto = {
      id: PRODUTO_ID_1, nome: 'Serviço Premium A', descricao: 'Detalhada A', valor: 1000,
      dataCriacao: new Date('2024-01-01T10:00:00Z'), dataAtualizacao: new Date('2024-01-01T10:00:01Z'),
      ativo: true, cliente_id: null, dataExclusao: null,
    };
    const mockProdutoData2: IProduto = {
      id: PRODUTO_ID_2, nome: 'Consultoria Especializada', descricao: 'Consultoria de 2 horas', valor: 500,
      dataCriacao: new Date('2024-02-01T10:00:00Z'), dataAtualizacao: new Date('2024-02-01T10:00:01Z'),
      ativo: true, cliente_id: null, dataExclusao: null,
    };
    const mockProdutoData3: IProduto = {
      id: PRODUTO_ID_3, nome: 'Manutenção Mensal', descricao: 'Pacote de manutenção', valor: 200,
      dataCriacao: new Date('2024-03-01T10:00:00Z'), dataAtualizacao: new Date('2024-03-01T10:00:01Z'),
      ativo: true, cliente_id: null, dataExclusao: null,
    };

    await prisma.produto.createMany({
      data: [
        ProdutoMap.toPersistence(produtoEntity.recuperar(mockProdutoData1)),
        ProdutoMap.toPersistence(produtoEntity.recuperar(mockProdutoData2)),
        ProdutoMap.toPersistence(produtoEntity.recuperar(mockProdutoData3)),
      ],
    });

    // Recupera como entidades de domínio para usar nos mocks de Cliente
    produtoDb1 = produtoEntity.recuperar(mockProdutoData1);
    produtoDb2 = produtoEntity.recuperar(mockProdutoData2);
    produtoDb3 = produtoEntity.recuperar(mockProdutoData3);
  });

    // 2. Criar o Cliente de teste (sem produtos inicialmente)
    CLIENTE_ID_PRODUTO_TESTE = randomUUID();
    await prisma.cliente.create({
      data: {
        id: CLIENTE_ID_PRODUTO_TESTE,
        nome: 'Cliente Produto Teste',
        email: 'produtoteste@example.com',
        telefone: '11912345678',
        cidade: 'Cidade Teste',
        status: 'ATIVO' as any, // Conversão para o enum do Prisma
        vendedor_responsavel: 'Vendedor Produtos',
        data_criacao: new Date(),
        data_atualizacao: new Date(),
        data_exclusao: null,
      },
    });


  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Testes para o método 'inserir' ---
  it('deve inserir um novo cliente com sucesso, conectando produtos existentes', async () => {
    const cliente = Cliente.criarCliente({
      pessoa: Pessoa.criar({ nome: 'Ana Costa', email: 'ana@example.com', telefone: '11987654321' }),
      cidade: 'Belo Horizonte',
      vendedorResponsavel: 'Vendedor Gama',
      produtos: [produtoDb1, produtoDb2], // Produtos existentes e sem cliente_id
    });

    await repository.inserir(cliente); // Este método DEVE fazer o connect

    const clienteSalvo = await prisma.cliente.findUnique({
      where: { id: cliente.id },
      include: { produtos: true }, // Inclui os produtos para verificação
    });

    expect(clienteSalvo).toBeDefined();
    expect(clienteSalvo?.id).toBe(cliente.id);
    expect(clienteSalvo?.produtos).toHaveLength(2);
    expect(clienteSalvo?.produtos.some(p => p.id === produtoDb1.id)).toBe(true);
    expect(clienteSalvo?.produtos.some(p => p.id === produtoDb2.id)).toBe(true);
  });

  // --- Testes para o método 'recuperarPorUuid' ---
  it('deve recuperar um cliente existente por ID, incluindo seus produtos', async () => {
    const cliente = Cliente.criarCliente({
      pessoa: Pessoa.criar({ nome: 'Bruno Lima', email: 'bruno@example.com', telefone: '11999998888' }),
      cidade: 'Recife',
      vendedorResponsavel: 'Vendedor Delta',
      produtos: [produtoDb1, produtoDb3], // Associando produtos
    });
    // Usar o repositório para inserir o cliente, que cuidará da conexão.
    await repository.inserir(cliente); 

    const clienteRecuperado = await repository.recuperarPorUuid(cliente.id);

    expect(clienteRecuperado).toBeInstanceOf(Cliente);
    expect(clienteRecuperado?.id).toBe(cliente.id);
    expect(clienteRecuperado?.pessoa.nome).toBe(cliente.pessoa.nome);
    expect(clienteRecuperado?.produtos).toHaveLength(2);
    expect(clienteRecuperado?.produtos.some(p => p.id === produtoDb1.id)).toBe(true);
    expect(clienteRecuperado?.produtos.some(p => p.id === produtoDb3.id)).toBe(true);
  });

  it('deve retornar null se o cliente não for encontrado por ID', async () => {
    const clienteRecuperado = await repository.recuperarPorUuid('id-inexistente');
    expect(clienteRecuperado).toBeNull();
  });

  // --- Testes para o método 'atualizar' ---
  it('deve atualizar os dados de um cliente existente', async () => {
    const clienteOriginal = Cliente.criarCliente({
      pessoa: Pessoa.criar({ nome: 'Duda Cordeiro', email: 'duda@example.com', telefone: '11111111111' }),
      cidade: 'Florianópolis',
      vendedorResponsavel: 'Vendedor Epsilon',
      produtos: [produtoDb2], // 1 produto
    });
    // Usar o repositório para inserir o cliente
    await repository.inserir(clienteOriginal); 

    // Modifica a entidade de domínio
    const novaCidade = 'Curitiba';
    const novoVendedor = 'Vendedor Zeta';
    vi.setSystemTime(new Date(Date.now() + 1000));
    const dataAtualizacaoEsperada = new Date();
    
    const clienteModificado = Cliente.recuperar({
      id: clienteOriginal.id,
      pessoa: clienteOriginal.pessoa,
      cidade: novaCidade,
      vendedorResponsavel: novoVendedor,
      dataCriacao: clienteOriginal.dataCriacao,
      dataAtualizacao: dataAtualizacaoEsperada,
      dataExclusao: clienteOriginal.dataExclusao,
      status: clienteOriginal.status,
      produtos: [produtoDb2, produtoDb3], // Adiciona um produto para testar a atualização da lista
    });

    // O método 'atualizar' do repositório é que deve fazer o 'set' para produtos.
    await repository.atualizar(clienteModificado); 

    const clienteAtualizado = await prisma.cliente.findUnique({
      where: { id: clienteOriginal.id },
      include: { produtos: true }, // Inclui produtos para verificar a atualização
    });

    expect(clienteAtualizado).toBeDefined();
    expect(clienteAtualizado?.cidade).toBe(novaCidade);
    expect(clienteAtualizado?.vendedor_responsavel).toBe(novoVendedor);
    expect(clienteAtualizado?.data_atualizacao.getTime()).toBe(dataAtualizacaoEsperada.getTime());
    expect(clienteAtualizado?.nome).toBe(clienteOriginal.pessoa.nome);
    expect(clienteAtualizado?.produtos).toHaveLength(2);
    expect(clienteAtualizado?.produtos.some(p => p.id === produtoDb2.id)).toBe(true);
    expect(clienteAtualizado?.produtos.some(p => p.id === produtoDb3.id)).toBe(true);
  });

  it('deve atualizar o status de um cliente para INATIVO', async () => {
    const clienteAtivo = Cliente.criarCliente({
      pessoa: Pessoa.criar({ nome: 'Tiago Rocha', email: 'tiago@example.com', telefone: '11222233333' }),
      cidade: 'Porto Alegre',
      vendedorResponsavel: 'Vendedor Kappa',
      produtos: [produtoDb1],
    });
    
    await repository.inserir(clienteAtivo); // O método inserir fará o connect

    const clienteInativadoProps: ICliente = {
      id: clienteAtivo.id,
      pessoa: clienteAtivo.pessoa,
      cidade: clienteAtivo.cidade,
      vendedorResponsavel: clienteAtivo.vendedorResponsavel,
      status: StatusCliente.INATIVO,
      dataCriacao: clienteAtivo.dataCriacao,
      dataAtualizacao: new Date(Date.now() + 1000),
      dataExclusao: new Date(),
      produtos: clienteAtivo.produtos, // Incluir produtos originais
    };
    const clienteInativado = Cliente.recuperar(clienteInativadoProps);

    await repository.atualizar(clienteInativado);

    const clienteAtualizadoNoDb = await prisma.cliente.findUnique({
      where: { id: clienteInativado.id },
      include: { produtos: true }, // Incluir produtos para verificação
    });

    expect(clienteAtualizadoNoDb?.status).toBe(StatusCliente.INATIVO as any);
    expect(clienteAtualizadoNoDb?.data_exclusao).toBeInstanceOf(Date);
    expect(clienteAtualizadoNoDb?.produtos).toHaveLength(1);
    expect(clienteAtualizadoNoDb?.produtos[0]?.id).toBe(produtoDb1.id);
  });

  it('deve buscar clientes por segmento TODOS_CLIENTES', async () => {
    const cliente1 = Cliente.criarCliente({ pessoa: Pessoa.criar({ nome: 'Cli1', telefone: '1' }), cidade: 'C1', vendedorResponsavel: 'V1', produtos: [produtoDb1] });
    const cliente2 = Cliente.criarCliente({ pessoa: Pessoa.criar({ nome: 'Cli2', telefone: '2' }), cidade: 'C2', vendedorResponsavel: 'V2', produtos: [produtoDb2] });
    await repository.inserir(cliente1);
    await repository.inserir(cliente2);

    const clientes = await repository.buscarPorSegmento(SegmentoAlvo.TODOS_CLIENTES);
    expect(clientes).toHaveLength(2);
    expect(clientes.some(c => c.id === cliente1.id)).toBe(true);
    expect(clientes.some(c => c.id === cliente2.id)).toBe(true);
  });

  it('deve retornar um array vazio se nenhum cliente for encontrado para um segmento', async () => {
    const clientes = await repository.buscarPorSegmento(SegmentoAlvo.NOVOS_CLIENTES);
    expect(clientes).toHaveLength(0);
  });
});