import { SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';
import { Produto } from '@modules/produtos/domain/produto.entity';
import { PrismaClient, StatusUsuario } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClienteRepositoryPrisma } from '../cliente.repository.prisma';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();
const repository = new ClienteRepositoryPrisma(prisma);

describe('ClienteRepositoryPrisma (Integration Tests)', () => {
  // =================================================================
  // IDs e Datas Fixas para Testes Determinísticos
  // =================================================================
  const PRODUTO_ID_1 = 'e58c787b-9b42-4cf4-a2c6-7a718b2f38a5';
  const PRODUTO_ID_2 = 'a1b9d6f8-3e2c-4b5d-9a1f-8c7b6a5e4d3c';
  const CLIENTE_ID_1 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const CLIENTE_ID_2 = '8c6b7e1a-4f5c-4a3b-8d9c-1e2f3a4b5c6d'; // Cliente antigo
  const CLIENTE_ID_3 = '7f4a2b9e-1c8d-4e5f-a9b0-8c7d6e5f4a3b'; // Cliente recente
  const EMPRESA_ID = randomUUID();

  const dataReferencia = new Date('2025-08-03T15:00:00.000Z');
  vi.setSystemTime(dataReferencia);

  const dataAntiga = new Date('2023-01-01T10:00:00.000Z');
  const dataRecente = new Date();

  let produtoDb1: Produto;
  let produtoDb2: Produto;

  beforeAll(async () => {
    // Garante que a empresa pai exista para as FKs
    await prisma.empresa.create({
      data: {
        id: EMPRESA_ID,
        nome: 'Empresa Teste',
        email: 'empresa@teste.com',
        plano: 'FREE',
        status: 'ATIVO',
      },
    });
  });

  beforeEach(async () => {
    // 1. Limpeza do Banco ANTES DE CADA TESTE (a ordem é crucial)
    await prisma.venda.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.produto.deleteMany({});

    // 2. Criação dos Dados Base (Produtos)
    await prisma.produto.createMany({
      data: [
        { id: PRODUTO_ID_1, nome: 'Serviço Premium', descricao: 'Detalhada A', valor: 1000, ativo: true, empresaId: EMPRESA_ID },
        { id: PRODUTO_ID_2, nome: 'Consultoria', descricao: 'Consultoria de 2 horas', valor: 500, ativo: true, empresaId: EMPRESA_ID },
      ],
    });

    // 3. Criação dos Clientes com a nova estrutura de dados
    await prisma.cliente.create({
      data: {
        id: CLIENTE_ID_1,
        nome: 'Cliente Ativo Teste',
        email: 'ativo@example.com',
        telefone: '11111111111',
        cidade: 'Cidade Teste',
        status: StatusUsuario.ATIVO,
        dataCriacao: dataAntiga,
        dataAtualizacao: dataAntiga,
        empresaId: EMPRESA_ID,
      },
    });

    await prisma.cliente.create({
      data: {
        id: CLIENTE_ID_2,
        nome: 'Cliente Antigo',
        email: 'antigo@example.com',
        telefone: '22222222222',
        cidade: 'Cidade Antiga',
        status: StatusUsuario.ATIVO,
        dataCriacao: dataAntiga,
        dataAtualizacao: dataAntiga,
        empresaId: EMPRESA_ID,
      },
    });

    await prisma.cliente.create({
      data: {
        id: CLIENTE_ID_3,
        nome: 'Cliente Novo',
        email: 'novo@example.com',
        telefone: '33333333333',
        cidade: 'Cidade Nova',
        status: StatusUsuario.ATIVO,
        dataCriacao: dataRecente,
        dataAtualizacao: dataRecente,
        empresaId: EMPRESA_ID,
      },
    });

    // 4. Recupera as entidades para usar nos testes
    const p1 = await prisma.produto.findUnique({ where: { id: PRODUTO_ID_1 } });
    const p2 = await prisma.produto.findUnique({ where: { id: PRODUTO_ID_2 } });
    if (p1 && p2) {
      produtoDb1 = Produto.recuperar(p1 as any);
      produtoDb2 = Produto.recuperar(p2 as any);
    }
  });

  afterAll(async () => {
    // Limpeza final de todas as tabelas
    await prisma.venda.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.produto.deleteMany({});
    await prisma.empresa.deleteMany({}); // Limpa a empresa criada no beforeAll
    await prisma.$disconnect();
  });

  // =================================================================
  // TESTES
  // =================================================================

  it('deve inserir um novo cliente e conectar produtos existentes', async () => {
    const novoCliente = Cliente.criarCliente({
      nome: 'Ana Costa',
      email: 'ana@example.com',
      telefone: '11987654321',
      cidade: 'Belo Horizonte',
      empresaId: EMPRESA_ID,
    });

    await repository.inserir(novoCliente);

   const clienteSalvo = await prisma.cliente.findUnique({
     where: { id: novoCliente.id },
   });

    expect(clienteSalvo).toBeDefined();
    expect(clienteSalvo?.nome).toBe('Ana Costa');
  });

  it('deve recuperar um cliente por ID, incluindo suas relações', async () => {
    const clienteRecuperado = await repository.recuperarPorUuid(CLIENTE_ID_1);

    expect(clienteRecuperado).toBeInstanceOf(Cliente);
    expect(clienteRecuperado?.id).toBe(CLIENTE_ID_1);
    expect(clienteRecuperado?.nome).toBe('Cliente Ativo Teste');
  });

  it('deve atualizar os dados de um cliente e sua lista de produtos', async () => {
    const clienteRecuperado = await repository.recuperarPorUuid(CLIENTE_ID_1);
    expect(clienteRecuperado).toBeDefined();

    clienteRecuperado!.atualizarCidade('Nova Cidade');
    
    await repository.atualizar(clienteRecuperado!);

    expect(clienteRecuperado?.cidade).toBe('Nova Cidade');
  });

  it('deve inativar um cliente e persistir a mudança', async () => {
    const clienteParaInativar = await repository.recuperarPorUuid(CLIENTE_ID_1);
    expect(clienteParaInativar?.status).toBe(StatusCliente.ATIVO);

    clienteParaInativar!.inativar();
    
    await repository.atualizar(clienteParaInativar!);

    const clienteDoDb = await prisma.cliente.findUnique({
      where: { id: CLIENTE_ID_1 },
    });

    expect(clienteDoDb?.status).toBe(StatusUsuario.INATIVO);
    expect(clienteDoDb?.dataExclusao).toBeInstanceOf(Date);
  });

  it('deve buscar clientes por segmento TODOS_CLIENTES e encontrar todos', async () => {
    const clientes = await repository.buscarPorSegmento(SegmentoAlvo.TODOS_CLIENTES);
    expect(clientes).toHaveLength(3);
  });

  it('deve buscar clientes por segmento NOVOS_CLIENTES e encontrar apenas o cliente recente', async () => {
    const clientes = await repository.buscarPorSegmento(SegmentoAlvo.NOVOS_CLIENTES);
    expect(clientes).toHaveLength(1);
    expect(clientes[0].id).toBe(CLIENTE_ID_3);
  });
});