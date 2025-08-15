import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { PerguntaResponseDTO } from "../../dto/pergunta/PerguntaResponseDTO";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { PerguntaMap } from "@modules/formulario/infra/mappers/pergunta.map";
import { AtualizarPerguntaInputDTO } from "../../dto/pergunta/AtualizarPerguntaDTO";

export class AtualizarPerguntaUseCase implements IUseCase<AtualizarPerguntaInputDTO, PerguntaResponseDTO> {
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(perguntaRepository: IPerguntaRepository) {
    this._perguntaRepository = perguntaRepository;
  }

  async execute(input: AtualizarPerguntaInputDTO): Promise<PerguntaResponseDTO> {
    // 1. Recuperar a entidade existente do banco de dados.
    const pergunta = await this._perguntaRepository.recuperarPorUuid(input.id);
    if (!pergunta) {
      throw new Error(`Pergunta com ID ${input.id} não encontrada.`);
    }

    // 2. Aplicar as atualizações na entidade de domínio.
    if (typeof input.texto === 'string') {
      pergunta.atualizarTexto(input.texto);
    }

    if (typeof input.tipo === 'string') {
      pergunta.atualizarTipo(input.tipo);
    }

    // 3. Persistir a entidade atualizada no banco de dados.
    await this._perguntaRepository.atualizar(pergunta);

    // 4. Retornar o DTO de resposta com os dados atualizados.
    return PerguntaMap.toDTO(pergunta);
  }
}