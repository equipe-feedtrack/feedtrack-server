import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";

export class DeletarCampanhaUseCase implements IUseCase<string, void> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

  async execute(id: string): Promise<void> {
    const existe = await this._campanhaRepository.existe(id);
    if (!existe) {
      throw new Error(`Campanha com ID ${id} não encontrada.`);
    }

    await this._campanhaRepository.deletar(id);
  }
}