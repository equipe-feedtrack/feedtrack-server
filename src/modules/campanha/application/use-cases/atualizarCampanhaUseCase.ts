import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { AtualizarCampanhaInputDTO } from "../dto/atualizarCampanhaInputDTO";
import { CampanhaResponseDTO } from "../dto/CampanhaResponseDTO";
import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CampanhaMap } from "@modules/campanha/infra/mappers/campanha.map";
import { CampanhaNaoEncontradaException } from "../exceptions/campanha.exception";
import { CanalEnvio } from "@modules/campanha/domain/campanha.types";

export class AtualizarCampanhaUseCase implements IUseCase<AtualizarCampanhaInputDTO, CampanhaResponseDTO> {
  private readonly _campanhaRepository: ICampanhaRepository;

  constructor(campanhaRepository: ICampanhaRepository) {
    this._campanhaRepository = campanhaRepository;
  }

async execute(input: AtualizarCampanhaInputDTO): Promise<CampanhaResponseDTO> {
  const campanha = await this._campanhaRepository.recuperarPorUuid(input.id, input.empresaId);
  if (!campanha) throw new CampanhaNaoEncontradaException();

  if (input.titulo !== undefined) campanha.atualizarTitulo(input.titulo);
  if (input.descricao !== undefined) campanha.atualizarDescricao(input.descricao);
  if (input.templateMensagem !== undefined) campanha.atualizarTemplate(input.templateMensagem);
  if (input.formularioId !== undefined) campanha.atualizarFormulario(input.formularioId);
  if (input.canalEnvio !== undefined) campanha.atualizarCanalEnvio(input.canalEnvio as CanalEnvio);

  await this._campanhaRepository.atualizar(campanha);

  return CampanhaMap.toResponseDTO(campanha);
}


}