import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CampanhaResponseDTO } from "../dto/CampanhaResponseDTO";
import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { CampanhaMap } from "@modules/campanha/infra/mappers/campanha.map";

import { CampanhaCompletaResponseDTO } from "../dto/CampanhaResponseDTO";

export interface BuscarCampanhaPorIdInput {
  id: string;
  empresaId: string;
}

export class BuscarCampanhaPorIdUseCase implements IUseCase<BuscarCampanhaPorIdInput, CampanhaCompletaResponseDTO | null> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

  async execute(input: BuscarCampanhaPorIdInput): Promise<CampanhaCompletaResponseDTO | null> {
    const { id, empresaId } = input;
    const campanha = await this._campanhaRepository.recuperarPorUuid(id, empresaId);

    if (!campanha) return null;

    return CampanhaMap.toResponseWithFormulario(campanha);
  }
}
