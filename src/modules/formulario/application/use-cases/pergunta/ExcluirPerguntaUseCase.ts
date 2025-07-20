import { Pergunta } from "@modules/formulario/domain/pergunta/domain/pergunta.entity";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta.repository.interface";
import { UseCaseException } from "@shared/application/use-case/use-case.exception";

export class ExcluirPerguntaUseCase {
  constructor(private readonly perguntaRepository: IPerguntaRepository<Pergunta>) {}

  async execute(id: string): Promise<void> {
    // 1. Busca a entidade a ser excluída.
    const pergunta = await this.perguntaRepository.recuperarPorUuid(id);

    if (!pergunta) {
      throw new UseCaseException;
    }

    // 2. Chama um método de negócio na entidade para realizar a exclusão lógica.
    // (Supondo que a entidade tenha um método 'inativar')
    pergunta.inativar();

    // 3. Salva o estado atualizado da entidade (agora inativa).
    await this.perguntaRepository.inserir(pergunta);
  }
}