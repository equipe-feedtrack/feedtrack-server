import { IProdutoRepository } from '@modules/produtos/infra/produto.repository.interface';
import { ProdutoMap } from '@modules/produtos/infra/mappers/produto.map';
import { CriarProdutoInputDTO } from '../dto/criar_produto_input.dto';
import { ProdutoResponseDTO } from '../dto/produto_response.dto';
import { Produto } from '@modules/produtos/domain/produto.entity';


export class CriarProdutoUseCase {
  constructor(
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async execute(input: CriarProdutoInputDTO): Promise<ProdutoResponseDTO> {

    const produto = Produto.criarProduto({
      nome: input.nome,
      descricao: input.descricao,
      valor: input.valor,
      empresaId: input.empresaId,
    });

    await this.produtoRepository.inserir(produto);

    return ProdutoMap.toDTO(produto);
  }
}