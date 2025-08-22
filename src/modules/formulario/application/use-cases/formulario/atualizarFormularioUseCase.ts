import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { FormularioResponseDTO } from "../../dto/formulario/FormularioResponseDTO";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta/pergunta.repository.interface";
import { AtualizarFormularioInputDTO } from "../../dto/formulario/atualizarFormularioDTO";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { FormularioMap } from "@modules/formulario/infra/mappers/formulario.map";

export class AtualizarFormularioUseCase implements IUseCase<AtualizarFormularioInputDTO, FormularioResponseDTO> {
  private readonly _formularioRepository: IFormularioRepository;
  private readonly _perguntaRepository: IPerguntaRepository;

  constructor(
    formularioRepository: IFormularioRepository,
    perguntaRepository: IPerguntaRepository
  ) {
    this._formularioRepository = formularioRepository;
    this._perguntaRepository = perguntaRepository;
  }

  async execute(input: AtualizarFormularioInputDTO): Promise<FormularioResponseDTO> {
    // 1. Recuperar a entidade existente.
    const formulario = await this._formularioRepository.recuperarPorUuid(input.id, input.empresaId);
    if (!formulario) {
      throw new Error(`Formulário com ID ${input.id} não encontrado.`);
    }

    // 2. Aplicar as atualizações na entidade de domínio.
    if (typeof input.titulo === 'string') {
      formulario.atualizarTitulo(input.titulo);
    }
    // Adicionar outros métodos de atualização para descricao, ativo, etc.

    // 3. Sincronizar a lista de perguntas, se fornecida.
    if (Array.isArray(input.idsPerguntas)) {
      const perguntasRecuperadas = await this._perguntaRepository.buscarMuitosPorId(input.idsPerguntas, input.empresaId);
      if (perguntasRecuperadas.length !== input.idsPerguntas.length) {
        throw new Error("Uma ou mais IDs de perguntas fornecidas são inválidas.");
      }
      // Remove todas as perguntas antigas e adiciona as novas
      const perguntasAtuaisIds = formulario.perguntas.map(p => p.id);
      for (const id of perguntasAtuaisIds) {
        formulario.removerPergunta(id);
      }
      for (const pergunta of perguntasRecuperadas) {
        formulario.adicionarPergunta(pergunta);
      }
    }

    // 4. Persistir a entidade atualizada.
    await this._formularioRepository.atualizar(formulario, input.empresaId);

    // 5. Retornar o DTO de resposta.
    return FormularioMap.toResponseDTO(formulario);
  }
}