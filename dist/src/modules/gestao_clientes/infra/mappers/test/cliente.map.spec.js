"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("@prisma/client");
const pessoa_entity_1 = require("@shared/domain/pessoa.entity");
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
const cliente_entity_1 = require("@modules/gestao_clientes/domain/cliente.entity");
const cliente_types_1 = require("@modules/gestao_clientes/domain/cliente.types");
const cliente_map_1 = require("../cliente.map");
const pessoa_map_1 = require("@shared/infra/mappers/pessoa.map");
const produto_map_1 = require("@modules/produtos/infra/mappers/produto.map");
// --- MOCKS DE DEPENDÊNCIAS EXTERNAS ---
vitest_1.vi.mock('@shared/infra/mappers/pessoa.map', () => ({
    PessoaMap: { toDomain: vitest_1.vi.fn(), toPersistence: vitest_1.vi.fn(), toDTO: vitest_1.vi.fn() },
}));
vitest_1.vi.mock('@modules/produtos/infra/mappers/produto.map', () => ({
    ProdutoMap: { toDomain: vitest_1.vi.fn(), toDTO: vitest_1.vi.fn() },
}));
(0, vitest_1.describe)('ClienteMap', () => {
    // =================================================================
    // MOCKS COM DADOS FIXOS - A CHAVE DA SOLUÇÃO
    // =================================================================
    const mockPessoa = pessoa_entity_1.Pessoa.recuperar({
        id: 'a3f4b21a-567e-4d8b-9e1a-2c3f4b5a6c7d', // ✅ ID FIXO
        nome: 'Carlos Silva',
        email: 'carlos@example.com',
        telefone: '11999998888',
    });
    const mockProduto = {
        id: 'f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454', // ✅ ID FIXO
        nome: 'Serviço A',
        descricao: 'Descrição do serviço A.',
        valor: 100,
        ativo: true,
        dataCriacao: new Date('2025-01-01T00:00:00.000Z'),
        dataAtualizacao: new Date('2025-01-01T00:00:00.000Z'),
        dataExclusao: null
    };
    const mockProdutoEntity = produto_entity_1.Produto.recuperar(mockProduto);
    console.log('OBJETO ESPERADO (definido no teste):', mockProdutoEntity);
    const mockClienteDomain = cliente_entity_1.Cliente.recuperar({
        id: '46e0a2e2-9b3b-4c6d-9e1a-8c3b4a5e6f7d', // ✅ ID FIXO
        pessoa: mockPessoa,
        cidade: 'Curitiba',
        vendedorResponsavel: 'Yago',
        status: cliente_types_1.StatusCliente.ATIVO,
        produtos: [mockProdutoEntity],
        dataCriacao: new Date('2024-01-01T10:00:00.000Z'),
        dataAtualizacao: new Date('2024-01-01T11:00:00.000Z'),
        dataExclusao: null,
    });
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        pessoa_map_1.PessoaMap.toDomain.mockReturnValue(mockPessoa);
        produto_map_1.ProdutoMap.toDomain.mockReturnValue(mockProdutoEntity);
        pessoa_map_1.PessoaMap.toDTO.mockReturnValue({ nome: mockPessoa.nome, email: mockPessoa.email, telefone: mockPessoa.telefone });
        produto_map_1.ProdutoMap.toDTO.mockReturnValue({ id: mockProdutoEntity.id, nome: mockProdutoEntity.nome, valor: mockProdutoEntity.valor });
    });
    // --- TESTES PARA toDomain ---
    (0, vitest_1.describe)('toDomain', () => {
        (0, vitest_1.it)('deve converter dados crus do Prisma (com relação N-N aninhada) para uma entidade Cliente', () => {
            // DADO: Um objeto mock que simula a resposta do Prisma para uma consulta N-N com include aninhado.
            const rawClientePrisma = {
                id: mockClienteDomain.id,
                nome: mockClienteDomain.pessoa.nome,
                email: mockClienteDomain.pessoa.email,
                telefone: mockClienteDomain.pessoa.telefone,
                cidade: mockClienteDomain.cidade,
                vendedorResponsavel: mockClienteDomain.vendedorResponsavel,
                status: client_1.StatusUsuario.ATIVO,
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
            vitest_1.vi.mocked(produto_map_1.ProdutoMap.toDomain).mockReturnValue(mockProdutoEntity);
            // QUANDO: O método toDomain é chamado com o mock aninhado
            const cliente = cliente_map_1.ClienteMap.toDomain(rawClientePrisma); // Usamos 'as any' para simplificar a tipagem do mock
            // ENTÃO: A conversão deve ser bem-sucedida
            (0, vitest_1.expect)(cliente).toBeInstanceOf(cliente_entity_1.Cliente);
            (0, vitest_1.expect)(cliente.id).toBe(rawClientePrisma.id);
            (0, vitest_1.expect)(cliente.produtos).toHaveLength(1);
            (0, vitest_1.expect)(cliente.produtos[0].id).toBe(mockProdutoEntity.id);
            // E o spy do ProdutoMap deve ter sido chamado com o objeto de produto desembrulhado
            (0, vitest_1.expect)(produto_map_1.ProdutoMap.toDomain).toHaveBeenCalledWith(mockProdutoEntity);
        });
    });
    // --- TESTES PARA toPersistence ---
    (0, vitest_1.describe)('toPersistence', () => {
        (0, vitest_1.it)('deve converter uma entidade Cliente para um objeto de persistência do Prisma', () => {
            const persistenceData = cliente_map_1.ClienteMap.toPersistence(mockClienteDomain);
            (0, vitest_1.expect)(persistenceData.id).toBe('46e0a2e2-9b3b-4c6d-9e1a-8c3b4a5e6f7d');
            (0, vitest_1.expect)(persistenceData.nome).toBe('Carlos Silva');
        });
        (0, vitest_1.it)('deve lidar com campos opcionais ausentes, como email', () => {
            const mockPessoaSemEmail = pessoa_entity_1.Pessoa.recuperar({ id: 'c1b2a3f4-5d6e-4b7c-8a9b-0c1d2e3f4a5b', nome: 'Ana', telefone: '2188887777', email: null });
            const clienteSemEmail = cliente_entity_1.Cliente.criarCliente({
                pessoa: mockPessoaSemEmail,
                cidade: 'São Paulo',
                vendedorResponsavel: 'Vendedor Teste',
                produtos: [mockProdutoEntity],
            });
            const persistenceData = cliente_map_1.ClienteMap.toPersistence(clienteSemEmail);
            (0, vitest_1.expect)(persistenceData.email).toBeNull();
        });
        (0, vitest_1.it)('deve mapear corretamente um cliente INATIVO', () => {
            const clienteInativo = cliente_entity_1.Cliente.recuperar({
                id: '46e0a2e2-9b3b-4c6d-9e1a-8c3b4a5e6f7d', // ✅ ID FIXO
                pessoa: mockPessoa,
                cidade: 'Recife',
                vendedorResponsavel: 'Mariana',
                status: cliente_types_1.StatusCliente.INATIVO,
                dataExclusao: new Date('2025-06-20T15:30:00Z'),
                produtos: [mockProdutoEntity],
                dataCriacao: new Date('2023-01-15T10:00:00Z'),
                dataAtualizacao: new Date('2025-06-20T15:30:00Z'),
            });
            const persistenceData = cliente_map_1.ClienteMap.toPersistence(clienteInativo);
            (0, vitest_1.expect)(persistenceData.status).toBe(client_1.StatusUsuario.INATIVO);
        });
    });
    // --- TESTES PARA toResponseDTO ---
    (0, vitest_1.describe)('toResponseDTO', () => {
        (0, vitest_1.it)('deve converter uma entidade Cliente para ClienteResponseDTO', () => {
            vitest_1.vi.mocked(produto_map_1.ProdutoMap.toDTO).mockImplementation((produtoRecebido) => {
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
            const dto = cliente_map_1.ClienteMap.toResponseDTO(mockClienteDomain);
            // ENTÃO
            // ✅ A verificação agora vai funcionar, pois só existe UMA instância de mockProdutoEntity no teste
            (0, vitest_1.expect)(produto_map_1.ProdutoMap.toDTO).toHaveBeenCalledWith(mockProdutoEntity);
            (0, vitest_1.expect)(pessoa_map_1.PessoaMap.toDTO).toHaveBeenCalledWith(mockClienteDomain.pessoa);
            (0, vitest_1.expect)(dto.id).toBe(mockClienteDomain.id);
            (0, vitest_1.expect)(dto.dataExclusao).toBeNull();
        });
        (0, vitest_1.it)('deve converter a data de exclusão para uma string no formato ISO quando ela existir', () => {
            const dataExclusaoFixa = new Date('2025-08-01T18:00:00.000Z');
            const clienteInativo = cliente_entity_1.Cliente.recuperar({
                id: 'c1b2a3f4-5d6e-4b7c-8a9b-0c1d2e3f4a5b', // ✅ ID FIXO
                pessoa: mockPessoa,
                cidade: 'Fortaleza',
                vendedorResponsavel: 'Yago',
                produtos: [mockProdutoEntity],
                dataCriacao: new Date('2024-01-01T12:00:00.000Z'),
                dataAtualizacao: dataExclusaoFixa,
                status: cliente_types_1.StatusCliente.INATIVO,
                dataExclusao: dataExclusaoFixa,
            });
            // QUANDO
            const dto = cliente_map_1.ClienteMap.toResponseDTO(clienteInativo);
            // ENTÃO
            (0, vitest_1.expect)(dto.dataExclusao).toBe('2025-08-01T18:00:00.000Z');
        });
    });
});
//# sourceMappingURL=cliente.map.spec.js.map