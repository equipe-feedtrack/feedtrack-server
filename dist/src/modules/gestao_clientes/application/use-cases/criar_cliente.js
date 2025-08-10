"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarClienteUseCase = void 0;
const cliente_entity_1 = require("@modules/gestao_clientes/domain/cliente.entity");
const cliente_map_1 = require("@modules/gestao_clientes/infra/mappers/cliente.map");
const pessoa_entity_1 = require("@shared/domain/pessoa.entity");
class CriarClienteUseCase {
    constructor(clienteRepository, produtoRepository // A dependência é necessária para validar e buscar os produtos.
    ) {
        this._clienteRepository = clienteRepository;
        this._produtoRepository = produtoRepository;
    }
    async execute(input) {
        // 1. Validação e Recuperação dos Produtos
        // Para satisfazer a regra de negócio de que um cliente deve ter produtos,
        // buscamos as entidades completas a partir dos IDs fornecidos.
        const produtosPromises = input.idsProdutos.map(id => this._produtoRepository.recuperarPorUuid(id));
        const produtosRecuperados = await Promise.all(produtosPromises);
        // Se algum produto não foi encontrado (é null), a operação falha.
        if (produtosRecuperados.some(p => p === null)) {
            throw new Error("Um ou mais IDs de produtos fornecidos são inválidos.");
        }
        // 2. Criação da Entidade Pessoa
        const pessoa = pessoa_entity_1.Pessoa.criar(input.pessoa);
        // 3. Criação da Entidade Cliente
        // A entidade Cliente é criada com a lista de produtos já validada e recuperada.
        const cliente = cliente_entity_1.Cliente.criarCliente({
            pessoa: pessoa,
            cidade: input.cidade,
            vendedorResponsavel: input.vendedorResponsavel,
            produtos: produtosRecuperados, // Passamos as entidades completas.
        });
        // 4. Persistência no Banco de Dados
        await this._clienteRepository.inserir(cliente);
        // 5. Retorno do DTO de Resposta
        // O ClienteMap converte a entidade de domínio para o formato de resposta da API.
        return cliente_map_1.ClienteMap.toResponseDTO(cliente);
    }
}
exports.CriarClienteUseCase = CriarClienteUseCase;
//# sourceMappingURL=criar_cliente.js.map