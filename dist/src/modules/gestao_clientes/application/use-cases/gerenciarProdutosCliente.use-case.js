"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerenciarProdutosClienteUseCase = void 0;
const cliente_exception_1 = require("@modules/gestao_clientes/domain/cliente.exception");
class GerenciarProdutosClienteUseCase {
    constructor(clienteRepository, produtoRepository // Adicionado repositório de Produto
    ) {
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }
    async execute(input) {
        const { clienteId, action, produtoId, novoProdutoId } = input;
        // 1. Busca a entidade de domínio do cliente
        const cliente = await this.clienteRepository.recuperarPorUuid(clienteId);
        if (!cliente) {
            throw new cliente_exception_1.ClienteExceptions.ClienteNaoEncontrado(`Cliente com ID ${clienteId} não encontrado.`);
        }
        // 2. Busca o objeto Produto para a ação
        const produto = await this.produtoRepository.recuperarPorUuid(produtoId);
        if (!produto) {
            throw new Error(`Produto com ID ${produtoId} não encontrado.`);
        }
        // 3. Executa a lógica de domínio com base na ação
        switch (action) {
            case 'adicionar':
                cliente.adicionarProduto(produto);
                break;
            case 'remover':
                cliente.removerProduto(produto);
                break;
            case 'editar':
                if (!novoProdutoId) {
                    throw new Error("Novo ID do produto é obrigatório para a ação 'editar'.");
                }
                const novoProduto = await this.produtoRepository.recuperarPorUuid(novoProdutoId);
                if (!novoProduto) {
                    throw new Error(`Novo produto com ID ${novoProdutoId} não encontrado.`);
                }
                cliente.editarProduto(produto, novoProduto);
                break;
            default:
                throw new Error(`Ação '${action}' inválida.`);
        }
        // 4. Persiste a entidade atualizada
        await this.clienteRepository.inserir(cliente);
    }
}
exports.GerenciarProdutosClienteUseCase = GerenciarProdutosClienteUseCase;
//# sourceMappingURL=gerenciarProdutosCliente.use-case.js.map