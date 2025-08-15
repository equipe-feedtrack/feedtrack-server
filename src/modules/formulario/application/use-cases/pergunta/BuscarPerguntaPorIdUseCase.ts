import { PerguntaMap } from "@modules/formulario/infra/mappers/pergunta.map";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { PerguntaResponseDTO } from "../../dto/pergunta/PerguntaResponseDTO";

export class BuscarPerguntaPorIdUseCase implements IUseCase<string, PerguntaResponseDTO | null> {
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(perguntaRepository: IPerguntaRepository) {
    this._perguntaRepository = perguntaRepository;
  }

  async execute(id: string): Promise<PerguntaResponseDTO | null> {
    // 1. Pede ao repositório para recuperar a entidade de domínio.
    const pergunta = await this._perguntaRepository.recuperarPorUuid(id);

    // 2. Se a entidade não for encontrada, retorna null.
    if (!pergunta) {
      return null;
    }

    // 3. Se encontrada, usa o mapper para converter a entidade em um DTO de resposta.
    return PerguntaMap.toDTO(pergunta);
  }
}