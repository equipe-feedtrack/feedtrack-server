import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CampanhaNaoEncontradaException } from "../exceptions/campanha.exception";

export interface DeletarCampanhaInput {
  id: string;
  empresaId: string;
}

export class DeletarCampanhaUseCase implements IUseCase<DeletarCampanhaInput, void> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

  async execute(input: DeletarCampanhaInput): Promise<void> {
    const { id, empresaId } = input;

    const existe = await this._campanhaRepository.existe(id, empresaId);
    if (!existe) {
      throw new CampanhaNaoEncontradaException();
    }

    await this._campanhaRepository.deletar(id, empresaId);
  }
}
