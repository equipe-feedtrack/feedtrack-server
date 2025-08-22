import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CriarCampanhaInputDTO } from "../dto/criarCampanhaInputDTO";
import { CampanhaResponseDTO } from "../dto/CampanhaResponseDTO";
import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Campanha } from "@modules/campanha/domain/campanha.entity";
import { CampanhaMap } from "@modules/campanha/infra/mappers/campanha.map";

export class CriarCampanhaUseCase implements IUseCase<CriarCampanhaInputDTO, CampanhaResponseDTO> {
  private readonly _campanhaRepository: ICampanhaRepository;
  private readonly _formularioRepository: IFormularioRepository;

  constructor(
    campanhaRepository: ICampanhaRepository,
    formularioRepository: IFormularioRepository
  ) {
    this._campanhaRepository = campanhaRepository;
    this._formularioRepository = formularioRepository;
  }

  async execute(input: CriarCampanhaInputDTO): Promise<CampanhaResponseDTO> {
    // 1. Validar se o formulário associado existe
    const formularioExiste = await this._formularioRepository.existe(input.formularioId, input.empresaId);
    if (!formularioExiste) {
      throw new Error(`Formulário com ID ${input.formularioId} não encontrado.`);
    }

    // 2. Criar a entidade de domínio Campanha
    const campanha = Campanha.criar(input);

    // 3. Persistir a nova entidade
    await this._campanhaRepository.inserir(campanha);

    // 4. Retornar o DTO de resposta
    return CampanhaMap.toResponseDTO(campanha);
  }
}