import { PerguntaMap } from "@modules/formulario/infra/mappers/pergunta.map";
import { PerguntaResponseDTO } from "../../dto/pergunta/PerguntaResponseDTO";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

/**
 * Caso de uso para listar todas as perguntas de uma empresa.
 */
export class ListarPerguntasUseCase implements IUseCase<string, PerguntaResponseDTO[]> {
  constructor(private readonly _perguntaRepository: IPerguntaRepository) {}

  async execute(empresaId: string): Promise<PerguntaResponseDTO[]> {
    // Chama o repositório passando apenas o empresaId
    const perguntas = await this._perguntaRepository.listar(empresaId);

    // Mapeia para DTOs
    return perguntas.map(PerguntaMap.toDTO);
  }
}
