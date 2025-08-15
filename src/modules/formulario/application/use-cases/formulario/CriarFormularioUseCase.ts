import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { FormularioResponseDTO } from "../../dto/formulario/FormularioResponseDTO";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { FormularioMap } from "@modules/formulario/infra/mappers/formulario.map";
import { CriarFormularioInputDTO } from "../../dto/formulario/CriarFormularioDTO";

export class CriarFormularioUseCase implements IUseCase<CriarFormularioInputDTO, FormularioResponseDTO> {
  private readonly _formularioRepository: IFormularioRepository<Formulario>;
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(
    formularioRepository: IFormularioRepository<Formulario>,
    perguntaRepository: IPerguntaRepository
  ) {
    this._formularioRepository = formularioRepository;
    this._perguntaRepository = perguntaRepository;
  }

  async execute(input: CriarFormularioInputDTO): Promise<FormularioResponseDTO> {
    // 1. Validação e Recuperação das Perguntas
    const perguntasRecuperadas = await this._perguntaRepository.buscarMuitosPorId(input.idsPerguntas);
    if (perguntasRecuperadas.length !== input.idsPerguntas.length) {
      throw new Error("Uma ou mais IDs de perguntas fornecidas são inválidas.");
    }

    // 2. Criação da Entidade de Domínio
    const formulario = Formulario.criar({
      titulo: input.titulo,
      descricao: input.descricao,
      ativo: input.ativo,
      empresaId: input.empresaId,
      perguntas: perguntasRecuperadas,
    });

    // 3. Persistência no Banco de Dados
    await this._formularioRepository.inserir(formulario);

    // 4. Retorno do DTO de Saída
    return FormularioMap.toResponseDTO(formulario);
  }
}