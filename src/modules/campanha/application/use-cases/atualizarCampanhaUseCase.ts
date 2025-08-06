import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { AtualizarCampanhaInputDTO } from "../dto/atualizarCampanhaInputDTO";
import { CampanhaResponseDTO } from "../dto/CampanhaResponseDTO";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CampanhaMap } from "@modules/campanha/infra/mappers/campanha.map";

export class AtualizarCampanhaUseCase implements IUseCase<AtualizarCampanhaInputDTO, CampanhaResponseDTO> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

  async execute(input: AtualizarCampanhaInputDTO): Promise<CampanhaResponseDTO> {
    // 1. Recuperar a entidade
    const campanha = await this._campanhaRepository.recuperarPorUuid(input.id);
    if (!campanha) {
      throw new Error(`Campanha com ID ${input.id} não encontrada.`);
    }

    // 2. Aplicar as atualizações usando os métodos de domínio
    if (input.templateMensagem) {
      campanha.atualizarTemplate(input.templateMensagem);
    }
    if (input.dataInicio) {
      campanha.atualizarPeriodo(input.dataInicio, input.dataFim);
    }

    // 3. Persistir a entidade atualizada
    await this._campanhaRepository.atualizar(campanha);

    // 4. Retornar o DTO de resposta
    return CampanhaMap.toResponseDTO(campanha);
  }
}