import { IProdutoRepository } from '@modules/produtos/infra/produto.repository.interface';
import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ProdutoMap } from '@modules/produtos/infra/mappers/produto.map';
import { CriarProdutoInputDTO } from '../dto/criar_produto_input.dto';
import { ProdutoResponseDTO } from '../dto/produto_response.dto';
import { Produto } from '@modules/produtos/domain/produto.entity';


export class CriarProdutoUseCase {
  constructor(
    private readonly produtoRepository: IProdutoRepository,
    private readonly clienteRepository: IClienteRepository, // Para validar a existência do cliente
  ) {}

  async execute(input: CriarProdutoInputDTO): Promise<ProdutoResponseDTO> {
    // 1. Valida se o Cliente existe (FK obrigatória)
    const clienteExiste = await this.clienteRepository.existe(input.cliente_id);
    if (!clienteExiste) {
      throw new Error(`Cliente com ID ${input.cliente_id} não encontrado.`); // Exceção específica
    }

    // 2. Cria a entidade Produto
    const produto = Produto.criarProduto({
      nome: input.nome,
      descricao: input.descricao,
      valor: input.valor,
    });

    // 3. Persiste o Produto (e conecta ao Cliente)
    await this.produtoRepository.inserir(produto);

    // 4. Retorna o DTO de resposta
    return ProdutoMap.toDTO(produto);
  }
}