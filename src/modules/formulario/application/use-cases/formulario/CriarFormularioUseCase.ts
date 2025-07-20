import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Pergunta } from "@modules/formulario/domain/pergunta/domain/pergunta.entity";
import { IFormularioRepository } from "@modules/formulario/infra/formulario.repository.interface";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta.repository.interface";
import { CriarFormularioDTO } from "../dto/formulario/CriarFormularioDTO";

export class CriarFormularioUseCase {
  constructor(
    private readonly formularioRepository: IFormularioRepository<Formulario>,
    private readonly perguntaRepository: IPerguntaRepository<Pergunta>, // Precisa de buscar as perguntas
  ) {}

  async execute(dto: CriarFormularioDTO): Promise<string> {
    // 1. Busca as entidades de Pergunta com base nos IDs recebidos
    const perguntas = await this.perguntaRepository.buscarMuitosPorId(dto.perguntasIds);
    if (perguntas.length !== dto.perguntasIds.length) {
      throw new Error("Uma ou mais perguntas não foram encontradas.");
    }
    
    // 2. Cria a entidade Formulário com as perguntas encontradas
    const formulario = Formulario.criar({
      titulo: dto.titulo,
      descricao: dto.descricao,
      perguntas: perguntas,
    });

    // 3. Salva o formulário, e o repositório se encarrega de conectar as perguntas
    await this.formularioRepository.inserir(formulario);
    return formulario.id;
  }
}