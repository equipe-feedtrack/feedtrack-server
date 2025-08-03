import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { PerguntaResponseDTO } from "../../dto/pergunta/PerguntaResponseDTO";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { PerguntaMap } from "@modules/formulario/infra/mappers/pergunta.map";
import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";
import { CriarPerguntaInputDTO } from "../../dto/pergunta/CriarPerguntaDTO";

export class CriarPerguntaUseCase implements IUseCase<CriarPerguntaInputDTO, PerguntaResponseDTO> {
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(perguntaRepository: IPerguntaRepository) {
    this._perguntaRepository = perguntaRepository;
  }

  async execute(input: CriarPerguntaInputDTO): Promise<PerguntaResponseDTO> {
    // 1. Usa o método de fábrica da entidade para criar uma nova instância de Pergunta.
    // A entidade é responsável por validar todas as regras de negócio.
    const pergunta = Pergunta.criar(input);

    // 2. Persiste a nova entidade no banco de dados.
    await this._perguntaRepository.inserir(pergunta);

    // 3. Retorna um DTO com os dados da pergunta criada.
    return PerguntaMap.toDTO(pergunta);
  }
}