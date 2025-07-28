import { IProdutoRepository } from '@modules/produtos/infra/produto.repository.interface';
import { ProdutoMap } from '@modules/produtos/infra/mappers/produto.map';
import { ProdutoResponseDTO } from '../dto/produto_response.dto';

export interface ListarProdutosInput {
  ativo?: boolean; // Exemplo de filtro
  cliente_id?: string; // Exemplo de filtro
  // Adicione outros filtros conforme necessário
}

export class ListarProdutosUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(filtros?: ListarProdutosInput): Promise<ProdutoResponseDTO[]> {
    // Você precisará adicionar um método `listar` ao seu IProdutoRepository
    // e implementá-lo em ProdutoRepositoryPrisma.
    const produtos = await this.produtoRepository.listar(filtros); 

    return produtos.map(ProdutoMap.toDTO);
  }
}