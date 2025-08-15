import { describe, expect, it, vi } from 'vitest';
import { ProdutoMap } from '../produto.map'; // Ajuste o caminho
import { Produto as ProdutoPrisma } from '@prisma/client'; // Importa Produto do Prisma Client
import { randomUUID } from 'crypto';
import { Produto } from '@modules/produtos/domain/produto.entity';
import e from 'express';
// Importe Status_Produto do PrismaClient se seu schema usa esse nome
// import { Status_Produto } from '@prisma/client'; 

// Mock do Produto.recuperar para isolar o mapper
vi.mock('../../domain/produtos/produto.entity', async (importOriginal) => {
  const actual = await importOriginal() as { Produto: typeof Produto }; 
  return {
    Produto: {
      ...actual.Produto,
      recuperar: vi.fn((props) => new actual.Produto(props)), // Garante que o construtor é chamado com props
      // Se Produto.recuperar tem lógica complexa, o mock pode precisar ser mais detalhado.
    },
  };
});

describe('ProdutoMap', () => {
  // Dados de mock para a entidade de domínio Produto
  const mockProdutoDomainData = {
    id: randomUUID(),
    nome: 'Fone Bluetooth XPTO',
    descricao: 'Fone de ouvido com cancelamento de ruído.',
    valor: 299.90,
    dataCriacao: new Date('2024-05-10T10:00:00.000Z'),
    dataAtualizacao: new Date('2024-05-10T11:00:00.000Z'),
    dataExclusao: null,
    ativo: true,
    empresaId: randomUUID(),
  };

  const mockProdutoDomainSemOpcionaisData = {
    id: randomUUID(),
    nome: 'Cabo USB C',
    descricao: 'Cabo de carregamento rápido e dados.',
    valor: 25.00,
    dataCriacao: new Date('2024-06-01T08:00:00.000Z'),
    dataAtualizacao: new Date('2024-06-01T09:00:00.000Z'),
    dataExclusao: null, // Mantém null se não especificado
    ativo: true,
    empresaId: randomUUID(),
  };

  const mockProdutoDomainDeletadoData = {
    id: randomUUID(),
    nome: 'Carregador Portátil',
    descricao: 'Carregador de bateria de alta capacidade.',
    valor: 120.00,
    dataCriacao: new Date('2024-04-01T10:00:00Z'),
    dataAtualizacao: new Date('2024-04-10T11:00:00Z'),
    dataExclusao: new Date('2024-04-15T12:00:00Z'), // Com data de exclusão
    ativo: false,
    empresaId: randomUUID(),
  };

  // Instâncias da entidade Produto (criadas usando Produto.recuperar)
  const mockProdutoDomain = Produto.recuperar(mockProdutoDomainData);
  const mockProdutoDomainSemOpcionais = Produto.recuperar(mockProdutoDomainSemOpcionaisData);
  const mockProdutoDomainDeletado = Produto.recuperar(mockProdutoDomainDeletadoData);


  // --- Testes para toDomain ---
  describe('toDomain', () => {
    // Dados crus (do Prisma) como viriam do banco (snake_case para datas e FK, nomes de enum)
    const rawProdutoPrismaCompleto: ProdutoPrisma = {
      id: mockProdutoDomainData.id,
      nome: mockProdutoDomainData.nome,
      descricao: mockProdutoDomainData.descricao,
      valor: mockProdutoDomainData.valor,
      dataCriacao: mockProdutoDomainData.dataCriacao,
      dataAtualizacao: mockProdutoDomainData.dataAtualizacao,
      dataExclusao: mockProdutoDomainData.dataExclusao,
      ativo: mockProdutoDomainData.ativo,
      empresaId: mockProdutoDomainData.empresaId,
    };

    const rawProdutoPrismaSemOpcionais: ProdutoPrisma = {
      id: mockProdutoDomainSemOpcionaisData.id,
      nome: mockProdutoDomainSemOpcionaisData.nome,
      descricao: mockProdutoDomainSemOpcionaisData.descricao,
      valor: mockProdutoDomainSemOpcionaisData.valor,
      dataCriacao: mockProdutoDomainSemOpcionaisData.dataCriacao,
      dataAtualizacao: mockProdutoDomainSemOpcionaisData.dataAtualizacao,
      dataExclusao: null,
      ativo: mockProdutoDomainSemOpcionaisData.ativo,
      empresaId: mockProdutoDomainSemOpcionaisData.empresaId,
    };

    it('deve converter dados crus do Prisma para uma entidade Produto completa', () => {
      const produto = ProdutoMap.toDomain(rawProdutoPrismaCompleto);

      expect(produto).toBeInstanceOf(Produto);
      expect(produto.id).toBe(rawProdutoPrismaCompleto.id);
      expect(produto.nome).toBe(rawProdutoPrismaCompleto.nome);
      expect(produto.descricao).toBe(rawProdutoPrismaCompleto.descricao);
      expect(produto.valor).toBe(rawProdutoPrismaCompleto.valor);
      expect(produto.dataCriacao).toEqual(rawProdutoPrismaCompleto.dataCriacao); // Mapeia snake_case para camelCase
      expect(produto.dataAtualizacao).toEqual(rawProdutoPrismaCompleto.dataAtualizacao);
      expect(produto.dataExclusao).toEqual(rawProdutoPrismaCompleto.dataExclusao);
      expect(produto.ativo).toBe(rawProdutoPrismaCompleto.ativo);
    });

    it('deve converter dados crus do Prisma com campos null para entidade com undefined/null corretamente', () => {
      const produto = ProdutoMap.toDomain(rawProdutoPrismaSemOpcionais);

      expect(produto.dataExclusao).toBeNull();
    });
  });

  // --- Testes para toPersistence ---
  describe('toPersistence', () => {
    it('deve converter uma entidade Produto completa para um objeto de persistência do Prisma', () => {
      const persistenceData = ProdutoMap.toPersistence(mockProdutoDomain);

      expect(persistenceData).toEqual({
        id: mockProdutoDomain.id,
        nome: mockProdutoDomain.nome,
        descricao: mockProdutoDomain.descricao,
        valor: mockProdutoDomain.valor,
        data_criacao: mockProdutoDomain.dataCriacao, // Mapeia camelCase para snake_case
        data_atualizacao: mockProdutoDomain.dataAtualizacao,
        data_exclusao: mockProdutoDomain.dataExclusao,
        ativo: mockProdutoDomain.ativo,
        empresaId: mockProdutoDomain.empresaId,
      });
    });

    it('deve converter uma entidade Produto sem opcionais para persistência com null/undefined', () => {
      const persistenceData = ProdutoMap.toPersistence(mockProdutoDomainSemOpcionais);

      expect(persistenceData.data_exclusao).toBeNull(); // undefined na entidade -> null no DB
    });
  });

  // --- Testes para toDTO ---
  describe('toDTO', () => {
    it('deve converter uma entidade Produto completa para ProdutoResponseDTO', () => {
      const dto = ProdutoMap.toDTO(mockProdutoDomain);

      expect(dto).toEqual({
        id: mockProdutoDomain.id,
        nome: mockProdutoDomain.nome,
        descricao: mockProdutoDomain.descricao,
        valor: mockProdutoDomain.valor,
        dataCriacao: mockProdutoDomain.dataCriacao.toISOString(),
        dataAtualizacao: mockProdutoDomain.dataAtualizacao.toISOString(),
        dataExclusao: mockProdutoDomain.dataExclusao?.toISOString(), // Trata null
        ativo: mockProdutoDomain.ativo,
        empresaId: mockProdutoDomain.empresaId,
      });
    });

    it('deve converter uma entidade Produto com dataExclusao para DTO corretamente', () => {
      const dto = ProdutoMap.toDTO(mockProdutoDomainDeletado);

      expect(dto.dataExclusao).toBe(mockProdutoDomainDeletado.dataExclusao?.toISOString());
      expect(dto.ativo).toBe(false);
    });

  });
});