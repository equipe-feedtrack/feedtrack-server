import { PerguntaMap } from "@modules/formulario/infra/mappers/pergunta.map";
import { PerguntaResponseDTO } from "../../dto/pergunta/PerguntaResponseDTO";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

// DTO para os filtros de entrada. Permite filtrar por status.
export interface ListarPerguntasInputDTO {
  ativo?: boolean;
}

/**
 * Caso de uso para listar perguntas com base em filtros opcionais.
 */
export class ListarPerguntasUseCase implements IUseCase<ListarPerguntasInputDTO | undefined, PerguntaResponseDTO[]> {
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(perguntaRepository: IPerguntaRepository) {
    this._perguntaRepository = perguntaRepository;
  }

  /**
   * Executa a listagem de perguntas.
   * @param filtros Um objeto opcional com os filtros a serem aplicados (ex: { ativo: true }).
   * @returns Uma promessa que resolve com um array de DTOs de pergunta.
   */
  async execute(filtros?: ListarPerguntasInputDTO): Promise<PerguntaResponseDTO[]> {
    // 1. Chama o método 'listar' do repositório, passando os filtros.
    const perguntas = await this._perguntaRepository.listar(filtros);
    
    // 2. Mapeia a lista de entidades de domínio para uma lista de DTOs de resposta.
    return perguntas.map(pergunta => PerguntaMap.toDTO(pergunta));
  }
}
