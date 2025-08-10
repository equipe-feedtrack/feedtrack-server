import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { UseCaseException } from "@shared/application/use-case/use-case.exception";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

export class DeletarPerguntaUseCase implements IUseCase<string, void> {
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(perguntaRepository: IPerguntaRepository) {
    this._perguntaRepository = perguntaRepository;
  }

  async execute(id: string): Promise<void> {
    // 1. Verificar se a pergunta existe antes de tentar deletar.
    const existe = await this._perguntaRepository.existe(id);
    if (!existe) {
      throw new Error(`Pergunta com ID ${id} não encontrada.`);
    }

    // 2. Chamar o repositório para deletar a pergunta.
    // O repositório é responsável por lidar com a remoção de associações.
    await this._perguntaRepository.deletar(id);
  }
}