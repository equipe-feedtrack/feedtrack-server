import { IFormulario } from "@modules/formulario/domain/formulario/formulario.types";
import { Pergunta } from "@modules/formulario/domain/pergunta/domain/pergunta.entity";
import { CriarPerguntaProps, IPergunta } from "@modules/formulario/domain/pergunta/domain/pergunta.types";
import { IFormularioRepository } from "@modules/formulario/infra/formulario.repository.interface";
import { IPerguntaRepository } from "@modules/formulario/infra/pergunta.repository.interface";
import { CriarPerguntaDTO } from "../dto/pergunta/CriarPerguntaDTO";
import { FormularioInexistente } from "@shared/application/use-case/use-case.exception";

export class CriarPerguntaUseCase {
  constructor(
    private readonly perguntaRepository: IPerguntaRepository<IPergunta>,
    private readonly formularioRepository: IFormularioRepository<IFormulario>,
  ) {}

  async execute(dto: CriarPerguntaDTO): Promise<string> {
    // 1. Regra de negócio: verificar se o formulário ao qual a pergunta pertence existe.
    const formularioExiste = await this.formularioRepository.recuperarPorUuid(dto.formularioId);
    if (!formularioExiste) {
      throw new FormularioInexistente;
    }

    // 2. Usa a fábrica da entidade para criar uma instância de domínio.
    // A fábrica já contém as validações de texto, tipo, etc.
    const pergunta = Pergunta.criar({
      texto: dto.texto,
      tipo: dto.tipo,
      opcoes: dto.opcoes,
    });

    // 3. Persiste a nova entidade no banco de dados.
    await this.perguntaRepository.inserir(pergunta);

    // 4. Retorna o ID da pergunta criada.
    return pergunta.id;
  }
}