import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CampanhaResponseDTO } from "../dto/CampanhaResponseDTO";
import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { CampanhaMap } from "@modules/campanha/infra/mappers/campanha.map";

export class ListarCampanhasUseCase implements IUseCase<void, CampanhaResponseDTO[]> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

  async execute(): Promise<CampanhaResponseDTO[]> {
    const campanhas = await this._campanhaRepository.listar();
    return campanhas.map(campanha => CampanhaMap.toResponseDTO(campanha));
  }
}