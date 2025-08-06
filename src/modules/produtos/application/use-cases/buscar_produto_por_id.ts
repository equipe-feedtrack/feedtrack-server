import { IProdutoRepository } from '@modules/produtos/infra/produto.repository.interface';
import { ProdutoMap } from '@modules/produtos/infra/mappers/produto.map';
import { ProdutoResponseDTO } from '../dto/produto_response.dto';

export class BuscarProdutoPorIdUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(id: string): Promise<ProdutoResponseDTO | null> {
    const produto = await this.produtoRepository.recuperarPorUuid(id);

    if (!produto) {
      return null;
    }

    return ProdutoMap.toDTO(produto);
  }
}