import { Pergunta } from "../domain/pergunta/domain/pergunta.entity";
import { CriarPerguntaProps } from "../domain/pergunta/domain/pergunta.types";
import { IPerguntaRepository } from "../infra/pergunta.repository.interface";

export class CriarPerguntaUseCase {
  constructor(private perguntaRepo: IPerguntaRepository<Pergunta>) {}

  async execute(props: CriarPerguntaProps): Promise<Pergunta> {
    // Cria a entidade Pergunta usando a fábrica do domínio
    const pergunta = Pergunta.criar(props);

    // Salva no repositório
    const perguntaSalva = await this.perguntaRepo.inserir(pergunta);

    return perguntaSalva;
  }
}