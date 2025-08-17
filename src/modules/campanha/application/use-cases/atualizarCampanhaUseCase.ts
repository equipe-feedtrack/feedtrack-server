import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { AtualizarCampanhaInputDTO } from "../dto/atualizarCampanhaInputDTO";
import { CampanhaResponseDTO } from "../dto/CampanhaResponseDTO";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CampanhaMap } from "@modules/campanha/infra/mappers/campanha.map";
import { CampanhaNaoEncontradaException } from "../exceptions/campanha.exception";

export class AtualizarCampanhaUseCase implements IUseCase<AtualizarCampanhaInputDTO, CampanhaResponseDTO> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

  async execute(input: AtualizarCampanhaInputDTO): Promise<CampanhaResponseDTO> {
    // 1. Recuperar a entidade
    const campanha = await this._campanhaRepository.recuperarPorUuid(input.id, input.empresaId);
    if (!campanha) {
      throw new CampanhaNaoEncontradaException();
    }



    // 3. Persistir a entidade atualizada
    await this._campanhaRepository.atualizar(campanha);

    // 4. Retornar o DTO de resposta
    return CampanhaMap.toResponseDTO(campanha);
  }
}