import { IProdutoRepository } from "@modules/produtos/infra/produto.repository.interface";
import { AtualizarProdutoInputDTO } from "../dto/atualizar_produto_input.dto";

import { ProdutoMap } from "@modules/produtos/infra/mappers/produto.map";
import { ProdutoResponseDTO } from "../dto/produto_response.dto";

export class AtualizarProdutoUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(input: AtualizarProdutoInputDTO): Promise<ProdutoResponseDTO> {
    // 1. Recuperar a entidade existente
    const produto = await this.produtoRepository.recuperarPorUuid(input.id);
    if (!produto) {
      throw new Error(`Produto com ID ${input.id} não encontrado.`); // Exceção específica
    }

    // 2. Aplicar as atualizações (a entidade sabe como mudar seu estado)
    if (input.nome !== undefined) {
      produto.atualizarNome(input.nome); // Crie este método na entidade Produto
    }
    if (input.descricao !== undefined) {
      produto.atualizarDescricao(input.descricao); // Crie este método na entidade Produto
    }
    if (input.valor !== undefined) {
      produto.atualizarValor(input.valor); // Crie este método na entidade Produto
    }
    if (input.ativo !== undefined) {
      if (input.ativo) {
        produto.ativar();
      } else {
        produto.inativar();
      }
    }
    
    // 3. Persistir a entidade atualizada
    await this.produtoRepository.atualizar(produto);

    // 4. Retornar o DTO de resposta
    return ProdutoMap.toDTO(produto);
  }
}