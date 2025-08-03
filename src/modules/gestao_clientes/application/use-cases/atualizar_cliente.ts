import { IClienteRepository } from '@modules/gestao_clientes/infra/cliente.repository.interface';
import { ClienteMap } from '@modules/gestao_clientes/infra/mappers/cliente.map';
import { ClienteResponseDTO } from '../dto/cliente_response.dto';
import { AtualizarClienteInputDTO } from '../dto/atualizar_cliente_input.dto';
import { IUseCase } from '@shared/application/use-case/usecase.interface';
import { IProdutoRepository } from '@modules/produtos/infra/produto.repository.interface';
import { StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';


export class AtualizarClienteUseCase implements IUseCase<AtualizarClienteInputDTO, ClienteResponseDTO> {
  private readonly _clienteRepository: IClienteRepository;
  private readonly _produtoRepository: IProdutoRepository;

  constructor(
    clienteRepository: IClienteRepository,
    produtoRepository: IProdutoRepository
  ) {
    this._clienteRepository = clienteRepository;
    this._produtoRepository = produtoRepository;
  }

  async execute(input: AtualizarClienteInputDTO): Promise<ClienteResponseDTO> {
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
    if (input.status === StatusCliente.INATIVO) {
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
    return ClienteMap.toResponseDTO(cliente);
  }
}