import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { FormularioMap } from "@modules/formulario/mappers/formulario.map";
import { FormularioInexistente } from "@shared/application/use-case/use-case.exception";
import { FormularioResponseDTO } from "../../dto/formulario/FormularioResponseDTO";

export class BuscarFormularioPorIdUseCase {
  constructor(private readonly formularioRepository: IFormularioRepository<Formulario>) {}

  async execute(id: string): Promise<FormularioResponseDTO> {
    // 1. Busca a entidade no repositório, incluindo suas perguntas.
    const formulario = await this.formularioRepository.recuperarPorUuid(id);

    if (!formulario) {
      throw new FormularioInexistente;
    }

    // 2. Usa o Mapper para converter a entidade em um DTO de resposta detalhado.
    return FormularioMap.toResponseDTO(formulario);
  }
}