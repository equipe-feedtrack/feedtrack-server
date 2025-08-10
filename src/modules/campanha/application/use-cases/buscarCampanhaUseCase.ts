import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CampanhaResponseDTO } from "../dto/CampanhaResponseDTO";
import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { CampanhaMap } from "@modules/campanha/infra/mappers/campanha.map";

export class BuscarCampanhaPorIdUseCase implements IUseCase<string, CampanhaResponseDTO | null> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

  async execute(id: string): Promise<CampanhaResponseDTO | null> {
    const campanha = await this._campanhaRepository.recuperarPorUuid(id);

    if (!campanha) {
      return null;
    }

    return CampanhaMap.toResponseDTO(campanha);
  }
}
