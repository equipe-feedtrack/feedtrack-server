import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cliente as ClientePrisma, StatusUsuario as StatusPrisma } from '@prisma/client';
import { Pessoa } from '@shared/domain/pessoa.entity';
import { Produto } from '@modules/produtos/domain/produto.entity';
import { IProduto } from '@modules/produtos/domain/produto.types';
import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { CriarClienteProps, StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';
import { ClienteMap } from '../cliente.map';
import { PessoaMap } from '@shared/infra/mappers/pessoa.map';
import { ProdutoMap } from '@modules/produtos/infra/mappers/produto.map';


// --- MOCKS DE DEPENDÊNCIAS EXTERNAS ---
vi.mock('@shared/infra/mappers/pessoa.map', () => ({
  PessoaMap: { toDomain: vi.fn(), toPersistence: vi.fn(), toDTO: vi.fn() },
}));
vi.mock('@modules/produtos/infra/mappers/produto.map', () => ({
  ProdutoMap: { toDomain: vi.fn(), toDTO: vi.fn() },
}));


describe('ClienteMap', () => {

  // =================================================================
  // MOCKS COM DADOS FIXOS - A CHAVE DA SOLUÇÃO
  // =================================================================

  const mockPessoa = Pessoa.recuperar({ 
    id: 'a3f4b21a-567e-4d8b-9e1a-2c3f4b5a6c7d', // ✅ ID FIXO
    nome: 'Carlos Silva', 
    email: 'carlos@example.com', 
    telefone: '11999998888',
  });

  const mockProduto: IProduto = {
    id: 'f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454', // ✅ ID FIXO
    nome: 'Serviço A',
    descricao: 'Descrição do serviço A.',
    valor: 100,
    ativo: true,
    dataCriacao: new Date('2025-01-01T00:00:00.000Z'),
    dataAtualizacao: new Date('2025-01-01T00:00:00.000Z'),
    dataExclusao: null
  };
  const mockProdutoEntity = Produto.recuperar(mockProduto);
  console.log('OBJETO ESPERADO (definido no teste):', mockProdutoEntity);

  const mockClienteDomain = Cliente.recuperar({
    id: '46e0a2e2-9b3b-4c6d-9e1a-8c3b4a5e6f7d', // ✅ ID FIXO
    pessoa: mockPessoa,
    cidade: 'Curitiba',
    vendedorResponsavel: 'Yago',
    status: StatusCliente.ATIVO,
    produtos: [mockProdutoEntity],
    dataCriacao: new Date('2024-01-01T10:00:00.000Z'),
    dataAtualizacao: new Date('2024-01-01T11:00:00.000Z'),
    dataExclusao: null,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (PessoaMap.toDomain as any).mockReturnValue(mockPessoa);
    (ProdutoMap.toDomain as any).mockReturnValue(mockProdutoEntity);
    (PessoaMap.toDTO as any).mockReturnValue({ nome: mockPessoa.nome, email: mockPessoa.email, telefone: mockPessoa.telefone });
    (ProdutoMap.toDTO as any).mockReturnValue({ id: mockProdutoEntity.id, nome: mockProdutoEntity.nome, valor: mockProdutoEntity.valor });
  });


  // --- TESTES PARA toDomain ---
describe('toDomain', () => {
    it('deve converter dados crus do Prisma (com relação N-N aninhada) para uma entidade Cliente', () => {
      
      // DADO: Um objeto mock que simula a resposta do Prisma para uma consulta N-N com include aninhado.
      const rawClientePrisma = {
        id: mockClienteDomain.id,
        nome: mockClienteDomain.pessoa.nome,
        email: mockClienteDomain.pessoa.email,
        telefone: mockClienteDomain.pessoa.telefone,
        cidade: mockClienteDomain.cidade,
        vendedorResponsavel: mockClienteDomain.vendedorResponsavel,
        status: StatusPrisma.ATIVO,
        dataCriacao: mockClienteDomain.dataCriacao,
        dataAtualizacao: mockClienteDomain.dataAtualizacao,
        dataExclusao: mockClienteDomain.dataExclusao,
        
        // ✅ CORREÇÃO: A estrutura de 'produtos' agora reflete a tabela de junção.
        // É um array de objetos, onde cada objeto tem uma propriedade 'produto'.
        produtos: [
          {
            clienteId: mockClienteDomain.id,
            produtoId: mockProdutoEntity.id,
            produto: mockProdutoEntity // O objeto do produto está aninhado aqui
          }
        ],
      };

      // Configura o spy para o comportamento esperado
      vi.mocked(ProdutoMap.toDomain).mockReturnValue(mockProdutoEntity);

      // QUANDO: O método toDomain é chamado com o mock aninhado
      const cliente = ClienteMap.toDomain(rawClientePrisma as any); // Usamos 'as any' para simplificar a tipagem do mock

      // ENTÃO: A conversão deve ser bem-sucedida
      expect(cliente).toBeInstanceOf(Cliente);
      expect(cliente.id).toBe(rawClientePrisma.id);
      expect(cliente.produtos).toHaveLength(1);
      expect(cliente.produtos[0].id).toBe(mockProdutoEntity.id);

      // E o spy do ProdutoMap deve ter sido chamado com o objeto de produto desembrulhado
      expect(ProdutoMap.toDomain).toHaveBeenCalledWith(mockProdutoEntity);
    });
  });

  // --- TESTES PARA toPersistence ---
  describe('toPersistence', () => {
    it('deve converter uma entidade Cliente para um objeto de persistência do Prisma', () => {
      const persistenceData = ClienteMap.toPersistence(mockClienteDomain);
      expect(persistenceData.id).toBe('46e0a2e2-9b3b-4c6d-9e1a-8c3b4a5e6f7d');
      expect(persistenceData.nome).toBe('Carlos Silva');
    });

    it('deve lidar com campos opcionais ausentes, como email', () => {
      const mockPessoaSemEmail = Pessoa.recuperar({ id: 'c1b2a3f4-5d6e-4b7c-8a9b-0c1d2e3f4a5b', nome: 'Ana', telefone: '2188887777', email: null });
      const clienteSemEmail = Cliente.criarCliente({
        pessoa: mockPessoaSemEmail,
        cidade: 'São Paulo',
        vendedorResponsavel: 'Vendedor Teste',
        produtos: [mockProdutoEntity],
      });
      
      const persistenceData = ClienteMap.toPersistence(clienteSemEmail);
      
      expect(persistenceData.email).toBeNull();
    });

    it('deve mapear corretamente um cliente INATIVO', () => { // ✅ Nome do teste corrigido para clareza
      const clienteInativo = Cliente.recuperar({
        id: '46e0a2e2-9b3b-4c6d-9e1a-8c3b4a5e6f7d', // ✅ ID FIXO
        pessoa: mockPessoa,
        cidade: 'Recife',
        vendedorResponsavel: 'Mariana',
        status: StatusCliente.INATIVO,
        dataExclusao: new Date('2025-06-20T15:30:00Z'),
        produtos: [mockProdutoEntity],
        dataCriacao: new Date('2023-01-15T10:00:00Z'),
        dataAtualizacao: new Date('2025-06-20T15:30:00Z'),
      });

      const persistenceData = ClienteMap.toPersistence(clienteInativo);

      expect(persistenceData.status).toBe(StatusPrisma.INATIVO);
    });
  });

  // --- TESTES PARA toResponseDTO ---
  describe('toResponseDTO', () => {
    it('deve converter uma entidade Cliente para ClienteResponseDTO', () => {
      
    vi.mocked(ProdutoMap.toDTO).mockImplementation((produtoRecebido) => {
    console.log('OBJETO RECEBIDO (dentro do spy):', produtoRecebido);
  
    // ✅ CORREÇÃO: Retorne um objeto completo que satisfaça o tipo ProdutoResponseDTO
    return { 
      id: produtoRecebido.id, 
      nome: produtoRecebido.nome,
      descricao: produtoRecebido.descricao,
      valor: produtoRecebido.valor,
      ativo: produtoRecebido.ativo,
      dataCriacao: produtoRecebido.dataCriacao.toISOString(),
      dataAtualizacao: produtoRecebido.dataAtualizacao.toISOString(),
      // Adicione outras propriedades do DTO se houver
    };
  });
      // QUANDO
      const dto = ClienteMap.toResponseDTO(mockClienteDomain);
      // ENTÃO
      // ✅ A verificação agora vai funcionar, pois só existe UMA instância de mockProdutoEntity no teste
      expect(ProdutoMap.toDTO).toHaveBeenCalledWith(mockProdutoEntity);
      expect(PessoaMap.toDTO).toHaveBeenCalledWith(mockClienteDomain.pessoa);
      expect(dto.id).toBe(mockClienteDomain.id);
      expect(dto.dataExclusao).toBeNull();
    });

    it('deve converter a data de exclusão para uma string no formato ISO quando ela existir', () => {
      const dataExclusaoFixa = new Date('2025-08-01T18:00:00.000Z');
      const clienteInativo = Cliente.recuperar({
        id: 'c1b2a3f4-5d6e-4b7c-8a9b-0c1d2e3f4a5b', // ✅ ID FIXO
        pessoa: mockPessoa,
        cidade: 'Fortaleza',
        vendedorResponsavel: 'Yago',
        produtos: [mockProdutoEntity],
        dataCriacao: new Date('2024-01-01T12:00:00.000Z'),
        dataAtualizacao: dataExclusaoFixa,
        status: StatusCliente.INATIVO,
        dataExclusao: dataExclusaoFixa,
      });

      // QUANDO
      const dto = ClienteMap.toResponseDTO(clienteInativo);

      // ENTÃO
      expect(dto.dataExclusao).toBe('2025-08-01T18:00:00.000Z');
    });
  });
});