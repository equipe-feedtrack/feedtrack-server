import { FormularioMap } from "@modules/formulario/mappers/formulario.map";
import { Cliente } from "@modules/gestao_clientes/domain/cliente/cliente.entity";
import { Entity } from "@shared/domain/entity";
import { Pergunta } from "../pergunta/pergunta.entity";
import { FormularioTituloVazioException } from "./formulario.exception";
import { CriarFormularioProps, IFormulario, RecuperarFormularioProps } from "./formulario.types";

class Formulario extends Entity<IFormulario> implements IFormulario {
 
  private _titulo: string;
  private _descricao?: string | undefined;
  private _perguntas: Pergunta[];
  private _cliente: Cliente;
  // private _funcionario: Funcionario;
  private _ativo: boolean;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;

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
    public get cliente(): Cliente {
    return this._cliente;
    }
    private set cliente(cliente: Cliente) {
      this._cliente = cliente;
    }
    // public get funcionario(): Funcionario {
    // return this._funcionario;
    // }
    // private set funcionario(funcionario: Funcionario) {
    //   this._funcionario = funcionario;
    // }
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
  
  private constructor(formulario: IFormulario) {
    super(formulario.id)
    this._titulo = formulario.titulo;
    this._descricao = formulario.descricao;
    this._perguntas = formulario.perguntas ?? [];
    this._cliente = formulario.cliente;
    // this._funcionario = formulario.funcionario;
    this._ativo = formulario.ativo ?? true;
    this._dataCriacao = formulario.dataCriacao ?? new Date();
    this._dataAtualizacao = formulario.dataAtualizacao ?? new Date();

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
    perguntas: formulario.perguntas,
    cliente: formulario.cliente,
    // funcionario: formulario.funcionario,
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

    public toDTO(): IFormulario {
        return FormularioMap.toDTO(this);
    }

  // Métodos para manipular perguntas
  public adicionarPergunta(pergunta: Pergunta): void {
    // Se quiser, pode validar se pergunta já existe na lista
    this.perguntas.push(pergunta);
    this.dataAtualizacao = new Date();
  }

  public removerPergunta(idPergunta: string): void {
    this.perguntas = this.perguntas.filter(p => p.id !== idPergunta);
    this.dataAtualizacao = new Date();
  }

  // Atualizar título ou descrição
  public atualizarTitulo(titulo: string): void {
    if (!titulo || titulo.trim().length === 0) {
      throw new FormularioTituloVazioException;
    }
    this.titulo = titulo;
    this.dataAtualizacao = new Date();
  }

  public atualizarDescricao(descricao: string): void {
    this.descricao = descricao;
    this.dataAtualizacao = new Date();
  }

  // Ativar ou desativar formulário
  public ativar(): void {
    this.ativo = true;
    this.dataAtualizacao = new Date();
  }

  public desativar(): void {
    this.ativo = false;
    this.dataAtualizacao = new Date();
  }
}

export { Formulario };
