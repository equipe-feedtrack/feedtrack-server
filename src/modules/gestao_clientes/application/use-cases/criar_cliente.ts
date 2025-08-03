import { Cliente } from '@modules/gestao_clientes/domain/cliente.entity';
import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { Produto } from '@modules/produtos/domain/produto.entity';
import { IProdutoRepository } from '@modules/produtos/infra/produto.repository.interface';
import { IUseCase } from '@shared/application/use-case/usecase.interface';
import { Pessoa } from '@shared/domain/pessoa.entity';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';
import { CriarClienteInputDTO } from '../dto/criar_cliente_input.dto';

export class CriarClienteUseCase implements IUseCase<CriarClienteInputDTO, ClienteResponseDTO> {
  private readonly _clienteRepository: IClienteRepository;
  private readonly _produtoRepository: IProdutoRepository;

  constructor(
    clienteRepository: IClienteRepository,
    produtoRepository: IProdutoRepository // A dependência é necessária para validar e buscar os produtos.
  ) {
    this._clienteRepository = clienteRepository;
    this._produtoRepository = produtoRepository;
  }

  async execute(input: CriarClienteInputDTO): Promise<ClienteResponseDTO> {
    
    // 1. Validação e Recuperação dos Produtos
    // Para satisfazer a regra de negócio de que um cliente deve ter produtos,
    // buscamos as entidades completas a partir dos IDs fornecidos.
    const produtosPromises = input.idsProdutos.map(id =>
      this._produtoRepository.recuperarPorUuid(id)
    );
    const produtosRecuperados = await Promise.all(produtosPromises);

    // Se algum produto não foi encontrado (é null), a operação falha.
    if (produtosRecuperados.some(p => p === null)) {
      throw new Error("Um ou mais IDs de produtos fornecidos são inválidos.");
    }

    // 2. Criação da Entidade Pessoa
    const pessoa = Pessoa.criar(input.pessoa);

    // 3. Criação da Entidade Cliente
    // A entidade Cliente é criada com a lista de produtos já validada e recuperada.
    const cliente = Cliente.criarCliente({
      pessoa: pessoa,
      cidade: input.cidade,
      vendedorResponsavel: input.vendedorResponsavel,
      produtos: produtosRecuperados as Produto[], // Passamos as entidades completas.
    });

    // 4. Persistência no Banco de Dados
    await this._clienteRepository.inserir(cliente);

    // 5. Retorno do DTO de Resposta
    // O ClienteMap converte a entidade de domínio para o formato de resposta da API.
    return ClienteMap.toResponseDTO(cliente);
  }
}