"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarClienteUseCase = void 0;
const cliente_map_1 = require("@modules/gestao_clientes/infra/mappers/cliente.map");
const cliente_types_1 = require("@modules/gestao_clientes/domain/cliente.types");
class AtualizarClienteUseCase {
    constructor(clienteRepository, produtoRepository) {
        this._clienteRepository = clienteRepository;
        this._produtoRepository = produtoRepository;
    }
    async execute(input) {
        // 1. Recuperar a entidade existente do banco de dados.
        const cliente = await this._clienteRepository.recuperarPorUuid(input.id);
        if (!cliente) {
            // Lança uma exceção se o cliente não for encontrado.
            throw new Error(`Cliente com ID ${input.id} não encontrado.`);
        }
        // 2. Aplicar as atualizações na entidade de domínio.
        // A própria entidade é responsável por validar e alterar seu estado.
        // Atualiza dados da Pessoa, se fornecidos.
        if (input.pessoa) {
            // A entidade Pessoa deve ter métodos para atualizar seus próprios dados.
            if (typeof input.pessoa.nome === 'string') {
                cliente.pessoa.atualizarNome(input.pessoa.nome);
            }
            if (input.pessoa.email !== undefined) {
                cliente.pessoa.atualizarEmail(input.pessoa.email);
            }
            if (typeof input.pessoa.telefone === 'string') {
                cliente.pessoa.atualizarTelefone(input.pessoa.telefone);
            }
        }
        // Atualiza dados diretos do Cliente.
        if (typeof input.cidade === 'string' || input.cidade === null) {
            cliente.atualizarCidade(input.cidade); // A entidade Cliente deve ter este método.
        }
        if (typeof input.vendedorResponsavel === 'string') {
            // cliente.atualizarVendedor(input.vendedorResponsavel); // A entidade Cliente deve ter este método.
        }
        if (input.status === cliente_types_1.StatusCliente.INATIVO) {
            cliente.inativar(); // Usa o método de domínio específico para inativar.
        }
        // Adicionar lógica para reativar se necessário.
        // 3. Gerencia a relação com Produtos.
        // Adiciona novos produtos, se fornecidos.
        if (input.idsProdutosParaAdicionar?.length) {
            for (const produtoId of input.idsProdutosParaAdicionar) {
                const produto = await this._produtoRepository.recuperarPorUuid(produtoId);
                if (produto) {
                    cliente.adicionarProduto(produto);
                }
            }
        }
        // Remove produtos, se fornecidos.
        if (input.idsProdutosParaRemover?.length) {
            for (const produtoId of input.idsProdutosParaRemover) {
                cliente.removerProduto(produtoId);
            }
        }
        // 4. Persistir a entidade atualizada no banco de dados.
        await this._clienteRepository.atualizar(cliente);
        // 5. Retornar o DTO de resposta com os dados atualizados.
        return cliente_map_1.ClienteMap.toResponseDTO(cliente);
    }
}
exports.AtualizarClienteUseCase = AtualizarClienteUseCase;
//# sourceMappingURL=atualizar_cliente.js.map