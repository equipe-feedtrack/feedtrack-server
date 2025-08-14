import { IProdutoRepository } from "@modules/produtos/infra/produto.repository.interface";
import { ProdutoResponseDTO } from "../dto/produto_response.dto";
import { ProdutoMap } from "@modules/produtos/infra/mappers/produto.map";

export class ReativarProdutoUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(id: string): Promise<ProdutoResponseDTO> {
    const produto = await this.produtoRepository.recuperarPorUuid(id);

    if (!produto) {
      throw new Error(`Produto com ID ${id} não encontrado.`);
    }

    produto.ativar();

    await this.produtoRepository.atualizar(produto);

    return ProdutoMap.toDTO(produto);
  }
}
