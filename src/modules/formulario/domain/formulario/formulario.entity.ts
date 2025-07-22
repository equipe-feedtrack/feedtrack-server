import { Entity } from "@shared/domain/entity";
import { Pergunta } from "../pergunta/pergunta.entity";
import { FormularioTituloVazioException } from "./formulario.exception";
import { CriarFormularioProps, IFormulario, RecuperarFormularioProps } from "./formulario.types";

class Formulario extends Entity<IFormulario> implements IFormulario {
 
  private _titulo: string;
  private _descricao?: string | undefined;
  private _perguntas: Pergunta[];
  private _ativo: boolean;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

    public get titulo(): string {
        return this._titulo;
    }
    private set titulo(titulo: string) {
        this._titulo = titulo;
    }
    public get descricao(): string | undefined {
        return this._descricao;
    }
    private set descricao(descricao: string | undefined) {
        this._descricao = descricao;
    }
    public get perguntas(): Pergunta[] {
        return this._perguntas;
    }
    private set perguntas(perguntas: Pergunta[]) {
        this._perguntas = perguntas;
    }
    public get ativo(): boolean {
        return this._ativo;
    }
    private set ativo(ativo: boolean) {
        this._ativo = ativo;
    }
    public get dataCriacao(): Date {
        return this._dataCriacao;
    }
    private set dataCriacao(dataCriacao: Date) {
        this._dataCriacao = dataCriacao;
    }
    public get dataAtualizacao(): Date {
        return this._dataAtualizacao;
    }
    private set dataAtualizacao(dataAtualizacao: Date) {
        this._dataAtualizacao = dataAtualizacao;
    }
    public get dataExclusao(): Date | null {
    return this._dataExclusao;
    }
    private set dataExclusao(value: Date | null) {
      this._dataExclusao = value;
    }
  
  public constructor(formulario: IFormulario) {
    super(formulario.id)
    this.titulo = formulario.titulo;
    this.descricao = formulario.descricao;
    this.perguntas = formulario.perguntas;
    this.ativo = formulario.ativo ?? true;
    this.dataCriacao = formulario.dataCriacao ?? new Date();
    this.dataAtualizacao = formulario.dataAtualizacao ?? new Date();
    this.dataExclusao = formulario.dataExclusao ?? null;
    this.validateFormulario();
  }

  // Validações básicas
  private  validateFormulario() {
    if (!this.titulo || this.titulo.trim().length === 0) {
      throw new FormularioTituloVazioException;
    }
    // Pode colocar outras validações aqui...
  }

  // criar um formulário novo
  public static criar(formulario: CriarFormularioProps): Formulario {
    return new Formulario({
    titulo: formulario.titulo,
    descricao: formulario.descricao,
    perguntas: formulario.perguntas ?? [],
    ativo: formulario.ativo,
    dataCriacao: formulario.dataCriacao,
    dataAtualizacao: formulario.dataAtualizacao
  });
  }

  // recuperar formulário (ex: reconstituir de banco)
  public static recuperar(formulario: RecuperarFormularioProps): Formulario {
    return new Formulario(formulario);
  }

    ///////////
    //Métodos///
    ///////////

  // Métodos para manipular perguntas
   public adicionarPergunta(pergunta: Pergunta): void {
    const jaExiste = this.perguntas.some(p => p.id === pergunta.id);
    if (jaExiste) {
      throw new Error("Esta pergunta já existe no formulário.");
    }
    this.perguntas.push(pergunta);
    this.dataAtualizacao = new Date();
  }

 public removerPergunta(perguntaId: string): void {
    this.perguntas = this.perguntas.filter(p => p.id !== perguntaId);
    this.dataAtualizacao = new Date();
  }

  // Atualizar título ou descrição
  public atualizarTitulo(titulo: string): void {
    if (!titulo || titulo.trim().length < 3) {
      throw new FormularioTituloVazioException;
    }
    this.titulo = titulo;
    this.dataAtualizacao = new Date();
  }

  public atualizarDescricao(descricao: string | undefined): void {
    this.descricao = descricao;
    this.dataAtualizacao = new Date();
  }

  public substituirPerguntas(novasPerguntas: Pergunta[]): void {
    // 1. Regra de negócio (opcional): Garante que um formulário não pode ficar sem perguntas.
    if (!novasPerguntas || novasPerguntas.length === 0) {
      throw new Error("Um formulário deve ter pelo menos uma pergunta.");
    }

    // 3. Substitui a lista antiga pela nova.
    this.perguntas = novasPerguntas;

    // 4. Atualiza a data de modificação.
    this.dataAtualizacao = new Date();
  }

  // Ativar
  public ativar(): void {
    this.ativo = true;
    this.dataAtualizacao = new Date();
  }
  //desativar formulário
  public desativar(): void {
     if (!this.ativo) {
      throw new Error("Este formulário já está inativo.");
    }

    this.ativo = false;
    this.dataAtualizacao = new Date();
    this.dataExclusao = new Date();

     this.perguntas.forEach(pergunta => {
      // Supondo que a entidade Pergunta também tenha um método inativar()
      pergunta.inativar(); 
     });
  }

}

export { Formulario };

