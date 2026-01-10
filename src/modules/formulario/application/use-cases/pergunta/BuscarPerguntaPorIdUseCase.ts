import { PerguntaMap } from "@modules/formulario/infra/mappers/pergunta.map";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { PerguntaResponseDTO } from "../../dto/pergunta/PerguntaResponseDTO";

export class BuscarPerguntaPorIdUseCase implements IUseCase<{ id: string; empresaId: string }, PerguntaResponseDTO | null> {
  constructor(private readonly _perguntaRepository: IPerguntaRepository) {}

  async execute(input: { id: string; empresaId: string }): Promise<PerguntaResponseDTO | null> {
    const { id, empresaId } = input;

    const pergunta = await this._perguntaRepository.recuperarPorUuid(id, empresaId);

    if (!pergunta) return null;

    return PerguntaMap.toDTO(pergunta);
  }
}
