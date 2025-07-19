import { Formulario } from "../domain/formulario/formulario.entity";
import { IFormularioRepository } from "../domain/formulario/formulario.repository.interface";
import { CriarFormularioDTO } from "./criarFormularioDTO";

export class FormularioUseCase {
  constructor(private formularioRepo: IFormularioRepository<Formulario>) {}

  async recuperarPorId(id: string): Promise<Formulario | null> {
    return await this.formularioRepo.recuperarPorUuid(id);
  }

  async recuperarTodos(): Promise<Formulario[]> {
    return await this.formularioRepo.recuperarTodos();
  }

  async criarFormulario(dados: CriarFormularioDTO): Promise<Formulario> {
    // Criar entidade de domínio, validar regras aqui (exemplo simples)
    const formulario = Formulario.criar({
      titulo: dados.titulo,
      descricao: dados.descricao,
      perguntas: dados.perguntas ?? [],
      ativo: dados.ativo ?? true,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    });

    // Persistir
    return await this.formularioRepo.inserir(formulario);
  }

  async atualizarFormulario(id: string, dados: AtualizarFormularioDTO): Promise<boolean> {
    // Pode fazer validações adicionais antes
    const formularioExistente = await this.formularioRepo.recuperarPorUuid(id);
    if (!formularioExistente) {
      throw new Error("Formulário não encontrado");
    }

    // Atualiza os campos desejados
    if (dados.titulo !== undefined) formularioExistente.atualizarTitulo(dados.titulo);
    if (dados.descricao !== undefined) formularioExistente.atualizarDescricao(dados.descricao);
    if (dados.ativo !== undefined) {
      dados.ativo ? formularioExistente.ativar() : formularioExistente.desativar();
    }

    // Persistir atualização
    return await this.formularioRepo.atualizar(id, formularioExistente);
  }

  async deletarFormulario(id: string): Promise<boolean> {
    return await this.formularioRepo.deletar(id);
  }
}