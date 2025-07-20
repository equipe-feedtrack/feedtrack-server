import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { FormularioInexistente } from "@shared/application/use-case/use-case.exception";

export class ExcluirFormularioUseCase {
  constructor(private readonly formularioRepository: IFormularioRepository<Formulario>) {}

  async execute(id: string): Promise<void> {
    // 1. Busca a entidade a ser excluída.
    const formulario = await this.formularioRepository.recuperarPorUuid(id);

    if (!formulario) {
      throw new FormularioInexistente;
    }

    // 2. Chama um método de negócio na entidade para realizar a exclusão lógica.
    formulario.desativar();

    // 3. Salva o estado atualizado da entidade (agora inativa).
    await this.formularioRepository.inserir(formulario);
  }
}