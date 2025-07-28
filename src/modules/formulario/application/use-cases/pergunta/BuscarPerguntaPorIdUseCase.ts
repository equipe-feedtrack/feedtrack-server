import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";

import { UseCaseException } from "@shared/application/use-case/use-case.exception";
import { PerguntaResponseDTO } from "../../dto/pergunta/PerguntaResponseDTO";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { PerguntaMap } from "@modules/formulario/infra/mappers/pergunta.map";


export class BuscarPerguntaPorIdUseCase {
  constructor(private readonly perguntaRepository: IPerguntaRepository<Pergunta>) {}

  async execute(id: string): Promise<PerguntaResponseDTO> {
    // 1. Busca a entidade no repositório.
    const pergunta = await this.perguntaRepository.recuperarPorUuid(id);

    if (!pergunta) {
      throw new UseCaseException;
    }

    // 2. Usa o Mapper para converter a entidade em um DTO seguro.
    return PerguntaMap.toDTO(pergunta);
  }
}