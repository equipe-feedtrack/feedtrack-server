import { Entity } from "@shared/domain/entity";
import { ClienteExceptions } from "./cliente.exception";
import { randomUUID } from "crypto";
import { ClienteEssencial, CriarClienteProps, ICliente, RecuperarClienteProps, StatusCliente } from "./cliente.types";

class Cliente extends Entity<ICliente> {

  // -------- ATRIBUTOS DA CLASSE CLIENTE -------
  private _nome: string;
  private _email: string | null;
  private _telefone: string;
  private _cidade: string | null;
  private _status: StatusCliente;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date ;
  private _dataExclusao: Date | null ;
  private _empresaId: string;
  
  
  // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------
  
  public get nome(): string {
    return this._nome;
  }

  private set nome(value: string) {
    if (!value || value.trim() === '') {
      throw new Error("Nome é obrigatório para criar um Cliente.");
    }  
    this._nome = value;
  }

  public get email(): string | null {
    return this._email;
  }

  private set email(value: string | null) {
    this._email = value;
  }

  public get telefone(): string {
    return this._telefone;
  }

  private set telefone(value: string) {
    if (!value || value.trim() === '') {
      throw new ClienteExceptions.TelefoneObrigatorioParaClienteException();
    }
    this._telefone = value;
  }

  public get cidade(): string | null  {
    return this._cidade;
  }

  private set cidade(value: string | null ) {
    this._cidade = value?.trim() ?? '';
  }

  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  private set dataCriacao(value: Date) {
    this._dataCriacao = value;
  }

  public get dataAtualizacao(): Date  {
    return this._dataAtualizacao;
  }

  private set dataAtualizacao(value: Date ) {
    this._dataAtualizacao = value;
  }

  public get dataExclusao(): Date | null  {
    return this._dataExclusao;
  }

  private set dataExclusao(value: Date | null ) {
    this._dataExclusao = value;
  }

  public get status(): StatusCliente  {
    return this._status;
  }

  private set status(value: StatusCliente ) {
    this._status = value;
    if (value === StatusCliente.INATIVO) {
      this.dataExclusao = new Date();
    }
  }

  public get empresaId(): string {
    return this._empresaId;
  }

  private set empresaId(empresaId: string) {
    this._empresaId = empresaId;
  }

  // ---------- CONSTRUTOR ----------

  constructor(cliente: ICliente) {
    super (cliente.id); // Vem do Entity.
    this.nome = cliente.nome;
    this.email = cliente.email ?? null;
    this.telefone = cliente.telefone;
    this.cidade = cliente.cidade;
    this.status = cliente.status;
    this.dataCriacao = cliente.dataCriacao;
    this.dataAtualizacao = cliente.dataAtualizacao;
    this.dataExclusao = cliente.dataExclusao;
    this.empresaId = cliente.empresaId;
  }

  // ---------- CRIA NOVO CLIENTE ----------
   public static criarCliente(props: CriarClienteProps): Cliente {
        const clienteCompleto: ICliente = { 
            id: randomUUID(),
            nome: props.nome,
            email: props.email,
            telefone: props.telefone,
            cidade: props.cidade,
            empresaId: props.empresaId,
            status: StatusCliente.ATIVO,
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        return new Cliente(clienteCompleto);
    }

    // ---------- RECUPERAR CLIENTE ----------
      public static recuperar(props: RecuperarClienteProps): Cliente {
        return new Cliente(props);
    }

  // ---------- MÉTODOS ----------

      public atualizarNome(novoNome: string): void {
        this.nome = novoNome;
        this.dataAtualizacao = new Date();
      }

      public atualizarEmail(novoEmail: string | null): void {
        this.email = novoEmail;
        this.dataAtualizacao = new Date();
      }

      public atualizarTelefone(novoTelefone: string): void {
        this.telefone = novoTelefone;
        this.dataAtualizacao = new Date();
      }

      public atualizarCidade(novaCidade: string ): void {
        this.cidade = novaCidade;
        this.dataAtualizacao = new Date();
    }

    public atualizarStatus(novoStatus: StatusCliente): void {
        if (this.status === novoStatus) return;
        this.status = novoStatus;
        this.dataAtualizacao = new Date();
    }

    public inativar(): void {
        if (this.status === StatusCliente.INATIVO) {
            throw new ClienteExceptions.ClienteJaInativo(this.id);
        }      
        this.status = StatusCliente.INATIVO;
        this.dataAtualizacao = new Date(); 
    }

    public reativar(): void {
        if (this.status === StatusCliente.ATIVO) {
            throw new ClienteExceptions.ClienteJaAtivo(this.id);
        }
        this.status = StatusCliente.ATIVO;
        this.dataExclusao = null;
        this.dataAtualizacao = new Date();
    }

    public estaDeletado(): boolean {
    return !!this.dataExclusao;
  }

    public recuperarDadosEssenciais(): ClienteEssencial { //Passa apenas as informações essenciais!
    return {
      nome: this.nome,
      email: this.email ?? '',
      telefone: this.telefone ?? '',
    };
  }
 
}

export { Cliente };