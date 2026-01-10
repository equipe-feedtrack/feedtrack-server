import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { UseCaseException } from "@shared/application/use-case/use-case.exception";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

type DeletarPerguntaInput = { id: string; empresaId: string };

export class DeletarPerguntaUseCase implements IUseCase<DeletarPerguntaInput, void> {
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(perguntaRepository: IPerguntaRepository) {
    this._perguntaRepository = perguntaRepository;
  }

  async execute(input: DeletarPerguntaInput): Promise<void> {
    const { id, empresaId } = input;

    const existe = await this._perguntaRepository.existe(id, empresaId);
    if (!existe) {
      throw new Error(`Pergunta com ID ${id} não encontrada.`);
    }

    await this._perguntaRepository.deletar(id, empresaId);
  }
}
