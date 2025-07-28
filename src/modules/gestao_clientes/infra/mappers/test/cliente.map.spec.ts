import { describe, expect, it, vi } from 'vitest';
import { ClienteMap } from '../cliente.map'; // Ajuste o caminho
import { Pessoa } from '@shared/domain/pessoa.entity'; // Entidade Pessoa
import { Cliente as ClientePrisma, Status_usuarios } from '@prisma/client'; // Cliente do Prisma Client
import { randomUUID } from 'crypto';
import { Produto } from '@modules/produtos/domain/produto.entity';
import { StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';
import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { PessoaMap } from '@shared/infra/mappers/pessoa.map';
import { ProdutoMap } from '@modules/produtos/infra/mappers/produto.map';

// Mocks para o ProdutoMap, já que ClienteMap o utiliza
vi.mock('@modules/produtos/mappers/produto.map', () => ({
  ProdutoMap: {
    toDomain: vi.fn((raw: any) => Produto.recuperar({ id: raw.id, nome: raw.nome, descricao: raw.descricao, valor: raw.valor, dataCriacao: new Date(), dataAtualizacao: new Date(), ativo: true, cliente_id: raw.cliente_id })),
    toDTO: vi.fn((produto: Produto) => ({ id: produto.id, nome: produto.nome, descricao: produto.descricao, valor: produto.valor, dataCriacao: produto.dataCriacao.toISOString(), dataAtualizacao: produto.dataAtualizacao.toISOString(), ativo: produto.ativo, cliente_id: produto.cliente_id })),
  },
}));

// Mocks para o PessoaMap, já que ClienteMap o utiliza
vi.mock('@shared/infra/mappers/pessoa.map', () => ({
  PessoaMap: {
    toDomain: vi.fn((raw: any) => Pessoa.recuperar({ id: raw.id, nome: raw.nome, email: raw.email, telefone: raw.telefone })),
    toPersistence: vi.fn((pessoa: Pessoa) => ({ nome: pessoa.nome, email: pessoa.email, telefone: pessoa.telefone })),
    toDTO: vi.fn((pessoa: Pessoa) => ({nome: pessoa.nome, email: pessoa.email, telefone: pessoa.telefone })),
  },
}));


describe('ClienteMap', () => {
  // Dados de mock para a entidade de domínio Cliente
  const mockPessoaData = { nome: 'Carlos', email: 'carlos@example.com', telefone: '11999998888' };
  const mockProdutoData = { nome: 'Serviço A', descricao: 'vamos falar mais sobre o produto', valor: 100, dataCriacao: new Date(), dataAtualizacao: new Date(), status: 'ATIVO' as any, ativo: true };
  
  const mockClienteDomainData = {
    id: randomUUID(),
    pessoa: Pessoa.recuperar(mockPessoaData), // Entidade Pessoa
    cidade: 'Curitiba',
    vendedorResponsavel: 'FuncionarioZ',
    status: StatusCliente.ATIVO,
    produtos: [Produto.recuperar(mockProdutoData as any)], // Lista de entidades Produto
    dataCriacao: new Date('2024-01-01T10:00:00.000Z'),
    dataAtualizacao: new Date('2024-01-01T11:00:00.000Z'),
    dataExclusao: null,
  };

  const mockClienteDomainSemOpcionaisData = {
    id: randomUUID(),
    pessoa: Pessoa.recuperar({ nome: 'Ana', telefone: '1122223333' }),
    cidade: undefined, // Sem cidade
    vendedorResponsavel: 'FuncionarioW',
    status: StatusCliente.ATIVO,
    produtos: [Produto.recuperar(mockProdutoData as any)],
    dataCriacao: new Date('2024-02-01T10:00:00.000Z'),
    dataAtualizacao: new Date('2024-02-01T11:00:00.000Z'),
    dataExclusao: null,
  };

  const mockClienteDomainInativoData = {
    id: randomUUID(),
    pessoa: Pessoa.recuperar({ nome: 'Pedro', telefone: '1155554444' }),
    cidade: 'Salvador',
    vendedorResponsavel: 'FuncionarioX',
    status: StatusCliente.INATIVO,
    produtos: [Produto.recuperar(mockProdutoData as any)],
    dataCriacao: new Date('2024-03-01T10:00:00.000Z'),
    dataAtualizacao: new Date('2024-03-01T11:00:00.000Z'),
    dataExclusao: new Date('2024-03-10T12:00:00.000Z'),
  };

  // Instâncias da entidade Cliente
  const mockClienteDomain = Cliente.recuperar(mockClienteDomainData);
  const mockClienteDomainSemOpcionais = Cliente.recuperar(mockClienteDomainSemOpcionaisData);
  const mockClienteDomainInativo = Cliente.recuperar(mockClienteDomainInativoData);

  // --- Testes para toDomain ---
  describe('toDomain', () => {
    // Dados crus do Prisma para Cliente (representando como o DB armazena)
    // Aqui, as propriedades da Pessoa estão diretas no ClientePrisma
    const rawClientePrismaCompleto: ClientePrisma & { produtos: any[] } = {
      id: mockClienteDomainData.id,
      nome: mockPessoaData.nome, // Propriedade de Pessoa direta no ClientePrisma
      email: mockPessoaData.email,
      telefone: mockPessoaData.telefone,
      cidade: mockClienteDomainData.cidade,
      vendedor_responsavel: mockClienteDomainData.vendedorResponsavel, // Ajuste para snake_case se DB usar
      status: mockClienteDomainData.status as Status_usuarios,
      data_criacao: mockClienteDomainData.dataCriacao,
      data_atualizacao: mockClienteDomainData.dataAtualizacao,
      data_exclusao: mockClienteDomainData.dataExclusao,
      produtos: [{ // Mock de produto em formato Prisma para toDomain
        nome: mockProdutoData.nome,
        descricao: mockProdutoData.descricao,
        valor: mockProdutoData.valor,
        data_criacao: mockProdutoData.dataCriacao,
        data_atualizacao: mockProdutoData.dataAtualizacao,
        status: mockProdutoData.status,
        ativo: mockProdutoData.ativo,
      }],
    };

    const rawClientePrismaSemOpcionais: ClientePrisma & { produtos: any[] } = {
      id: mockClienteDomainSemOpcionaisData.id,
      nome: mockClienteDomainSemOpcionaisData.pessoa.nome,
      email: null, // null no DB para email undefined
      telefone: mockClienteDomainSemOpcionaisData.pessoa.telefone,
      cidade: null, // null no DB para cidade undefined
      vendedorResponsavel: mockClienteDomainSemOpcionaisData.vendedorResponsavel,
      status: mockClienteDomainSemOpcionaisData.status as Status_usuarios,
      data_criacao: mockClienteDomainSemOpcionaisData.dataCriacao,
      data_atualizacao: mockClienteDomainSemOpcionaisData.dataAtualizacao,
      data_exclusao: null,
      produtos: [{ // Mock de produto em formato Prisma para toDomain
        nome: mockProdutoData.nome,
        descricao: mockProdutoData.descricao,
        valor: mockProdutoData.valor,
        data_criacao: mockProdutoData.dataCriacao,
        data_atualizacao: mockProdutoData.dataAtualizacao,
        status: mockProdutoData.status,
        ativo: mockProdutoData.ativo,
        cliente_id: null, // Placeholder para FK de Produto
      }],
      cliente_id: null,
    };


    it('deve converter dados crus do Prisma para uma entidade Cliente completa', () => {
      const cliente = ClienteMap.toDomain(rawClientePrismaCompleto);

      expect(cliente).toBeInstanceOf(Cliente);
      expect(PessoaMap.toDomain).toHaveBeenCalledWith(
        expect.objectContaining({
          id: rawClientePrismaCompleto.id, // Se Pessoa.id é o mesmo de Cliente.id
          nome: rawClientePrismaCompleto.nome,
          email: rawClientePrismaCompleto.email,
          telefone: rawClientePrismaCompleto.telefone,
        })
      );
      expect(cliente.id).toBe(rawClientePrismaCompleto.id);
      expect(cliente.pessoa.nome).toBe(rawClientePrismaCompleto.nome);
      expect(cliente.cidade).toBe(rawClientePrismaCompleto.cidade);
      expect(cliente.vendedorResponsavel).toBe(rawClientePrismaCompleto.vendedor_responsavel);
      expect(cliente.status).toBe(rawClientePrismaCompleto.status);
      expect(cliente.dataCriacao).toEqual(rawClientePrismaCompleto.data_criacao);
      expect(cliente.dataAtualizacao).toEqual(rawClientePrismaCompleto.data_atualizacao);
      expect(cliente.dataExclusao).toEqual(rawClientePrismaCompleto.data_exclusao);
      expect(ProdutoMap.toDomain).toHaveBeenCalledTimes(rawClientePrismaCompleto.produtos.length);
      expect(cliente.produtos).toHaveLength(rawClientePrismaCompleto.produtos.length);
    });

    it('deve converter dados crus do Prisma com campos null para entidade com undefined/null corretamente', () => {
      const cliente = ClienteMap.toDomain(rawClientePrismaSemOpcionais);

      expect(cliente.cidade).toBeUndefined();
      expect(cliente.pessoa.email).toBeUndefined(); // null do DB -> undefined na entidade
    });
  });

  // --- Testes para toPersistence ---
  describe('toPersistence', () => {
    it('deve converter uma entidade Cliente completa para um objeto de persistência do Prisma', () => {
      const persistenceData = ClienteMap.toPersistence(mockClienteDomain);

      expect(PessoaMap.toPersistence).toHaveBeenCalledWith(mockClienteDomain.pessoa);
      expect(persistenceData).toEqual(
        expect.objectContaining({
          id: mockClienteDomain.id,
          nome: mockClienteDomain.pessoa.nome,
          email: mockClienteDomain.pessoa.email,
          telefone: mockClienteDomain.pessoa.telefone,
          cidade: mockClienteDomain.cidade,
          vendedorResponsavel: mockClienteDomain.vendedorResponsavel,
          status: mockClienteDomain.status as Status_usuarios,
          data_criacao: mockClienteDomain.dataCriacao,
          data_atualizacao: mockClienteDomain.dataAtualizacao,
          data_exclusao: mockClienteDomain.dataExclusao,
        })
      );
    });

    it('deve converter uma entidade Cliente sem opcionais para persistência com null', () => {
      const persistenceData = ClienteMap.toPersistence(mockClienteDomainSemOpcionais);

      expect(persistenceData.cidade).toBeNull(); // undefined da entidade -> null no DB
      expect(persistenceData.email).toBeNull(); // undefined da entidade -> null no DB
    });
  });

  // --- Testes para toResponseDTO ---
  describe('toResponseDTO', () => {
    it('deve converter uma entidade Cliente completa para ClienteResponseDTO', () => {
      const dto = ClienteMap.toResponseDTO(mockClienteDomain);

      expect(PessoaMap.toDTO).toHaveBeenCalledWith(mockClienteDomain.pessoa);
      expect(ProdutoMap.toDTO).toHaveBeenCalledTimes(mockClienteDomain.produtos.length);
      expect(dto).toEqual(
        expect.objectContaining({
          id: mockClienteDomain.id,
          pessoa: expect.objectContaining({
            nome: mockClienteDomain.pessoa.nome,
            email: mockClienteDomain.pessoa.email,
            telefone: mockClienteDomain.pessoa.telefone,
          }),
          cidade: mockClienteDomain.cidade,
          vendedorResponsavel: mockClienteDomain.vendedorResponsavel,
          status: mockClienteDomain.status,
          produtos: expect.arrayContaining([
            expect.objectContaining({ id: mockProdutoData.id }),
          ]),
          dataCriacao: mockClienteDomain.dataCriacao.toISOString(),
          dataAtualizacao: mockClienteDomain.dataAtualizacao.toISOString(),
          dataExclusao: null,
        })
      );
      expect(dto).not.toHaveProperty('dataExclusao'); // Se dataExclusao for null, não deve aparecer
    });

    it('deve converter uma entidade Cliente sem opcionais para DTO com undefined', () => {
      const dto = ClienteMap.toResponseDTO(mockClienteDomainSemOpcionais);

      expect(dto.cidade).toBeUndefined();
      expect(dto.pessoa.email).toBeUndefined();
      expect(dto.dataExclusao).toBeUndefined(); // Se dataExclusao for null, deve ser undefined
    });

    it('deve converter uma entidade Cliente inativa para DTO', () => {
      const dto = ClienteMap.toResponseDTO(mockClienteDomainInativo);

      expect(dto.status).toBe(StatusCliente.INATIVO);
      expect(dto.dataExclusao).toBe(mockClienteDomainInativo.dataExclusao?.toISOString()); // dataExclusao deve ser string ISO
    });
  });
});