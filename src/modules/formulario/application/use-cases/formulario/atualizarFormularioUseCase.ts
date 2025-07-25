import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { FormularioInexistente } from "@shared/application/use-case/use-case.exception";
import { AtualizarFormularioDTO } from "../../dto/formulario/atualizarFormularioDTO";

export class AtualizarFormularioUseCase {
  constructor(private readonly formularioRepository: IFormularioRepository<Formulario>) {}

  async execute(id: string, dto: AtualizarFormularioDTO): Promise<void> {
    // 1. Busca a entidade que será atualizada.
    const formulario = await this.formularioRepository.recuperarPorUuid(id);

    if (!formulario) {
      throw new FormularioInexistente;
    }

    // 2. Chama os métodos de negócio da entidade para alterar o estado.
    formulario.atualizarTitulo(dto.titulo);
    formulario.atualizarDescricao(dto.descricao);

    // 3. Cria as novas instâncias de Pergunta que substituirão as antigas.
    const novasPerguntas = dto.perguntas.map(p =>
      Pergunta.criar({
        texto: p.texto,
        tipo: p.tipo,
        opcoes: p.opcoes,
      })
    );
    
    // 4. Chama um método na entidade Formulário para atualizar as perguntas.
    formulario.substituirPerguntas(novasPerguntas);

    // 5. Salva a entidade com seu novo estado.
    await this.formularioRepository.inserir(formulario);
  }
}