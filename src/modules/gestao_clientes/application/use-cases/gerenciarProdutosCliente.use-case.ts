import { ClienteExceptions } from "@modules/gestao_clientes/domain/cliente.exception";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
import { GerenciarProdutosInput } from "../dto/GerenciarProdutosInput.dto";
import { IProdutoRepository } from "@modules/produtos/infra/produto.repository.interface";
import { error } from "console";

export class GerenciarProdutosClienteUseCase {
  constructor(
    private readonly clienteRepository: IClienteRepository,
    private readonly produtoRepository: IProdutoRepository // Adicionado repositório de Produto
  ) {}

  public async execute(input: GerenciarProdutosInput): Promise<void> {
    const { clienteId, action, produtoId, novoProdutoId } = input;

    // 1. Busca a entidade de domínio do cliente
    const cliente = await this.clienteRepository.recuperarPorUuid(clienteId);

    if (!cliente) {
      throw new ClienteExceptions.ClienteNaoEncontrado(`Cliente com ID ${clienteId} não encontrado.`);
    }

    // 2. Busca o objeto Produto para a ação
    const produto = await this.produtoRepository.recuperarPorUuid(produtoId);
    if (!produto) {
      throw new Error(`Produto com ID ${produtoId} não encontrado.`);
    }

    // 3. Executa a lógica de domínio com base na ação
    switch (action) {
      case 'adicionar':
        cliente.adicionarProduto(produto.id);
        break;
      case 'remover':
        cliente.removerProduto(produto.id);
        break;
      case 'editar':
        if (!novoProdutoId) {
          throw new Error("Novo ID do produto é obrigatório para a ação 'editar'.");
        }
        const novoProduto = await this.produtoRepository.recuperarPorUuid(novoProdutoId);
        if (!novoProduto) {
           throw new Error(`Novo produto com ID ${novoProdutoId} não encontrado.`);
        }
        cliente.editarProduto(produto.id, novoProduto.id);
        break;
      default:
        throw new Error(`Ação '${action}' inválida.`);
    }

    // 4. Persiste a entidade atualizada
    await this.clienteRepository.inserir(cliente);
  }
}