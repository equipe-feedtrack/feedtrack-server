import { IPergunta } from "@modules/formulario/domain/pergunta/domain/pergunta.types";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta.repository.interface";
import { UseCaseException } from "@shared/application/use-case/use-case.exception";
import { AtualizarPerguntaDTO } from "../dto/pergunta/AtualizarPerguntaDTO";

export class AtualizarPerguntaUseCase {
  constructor(private readonly perguntaRepository: IPerguntaRepository<IPergunta>) {}

  async execute(id: string, dto: AtualizarPerguntaDTO): Promise<void> {
    // 1. Busca a entidade que será atualizada.
    const pergunta = await this.perguntaRepository.recuperarPorUuid(id);

    if (!pergunta) {
      throw new UseCaseException('Pergunta não encontrada.');
    }

    // 2. Chama os métodos de negócio da própria entidade para alterar o estado.
    // (Supondo que a entidade Pergunta tenha métodos como estes)
    // if (dto.texto) {
    //   pergunta.alterarTexto(dto.texto);
    // }
    // if (dto.tipo) {
    //   pergunta.alterarTipoEopcoes(dto.tipo, dto.opcoes);
    // }

    // 3. Salva a entidade com seu novo estado.
    await this.perguntaRepository.inserir(pergunta);
  }
}