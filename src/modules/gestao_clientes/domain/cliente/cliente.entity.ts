import { Produto } from "modules/produtos/produto.entity";
import { ICliente, CriarClienteProps, StatusCliente, RecuperarClienteProps } from "./cliente.types";
import { ClienteExceptions } from "./cliente.exeption";
import { Entity } from "@shared/domain/entity";
import { ClienteMap } from "modules/mappers/cliente.map";


class Cliente extends Entity<ICliente> implements ICliente {

  // -------- ATRIBUTOS DA CLASSE CLIENTE -------

  private _nome: string;
  private _telefone: string;
  private _email: string;
  private _cidade: string;
  private _status?: StatusCliente | undefined;
  private _dataCriacao?: Date | undefined;
  private _dataAtualizacao?: Date | undefined;
  private _dataExclusao?: Date | null | undefined;
  private _vendedorResponsavel: string;
  private _produtos: Array<Produto>;


  // ---------- CONSTANTES -------------------------------

  public static readonly QTD_MINIMA_PRODUTOS = 1;


  // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------


  public get nome(): string {
    return this._nome;
  }
  private set nome(value: string) {
    if (!value || value.trim() === '') throw new Error("Nome do cliente é obrigatório.");
    this._nome = value.trim();
  }

  public get telefone(): string {
    return this._telefone;
  }
  private set telefone(value: string) {
    const regexTelefone = /^[\d\s()+-]{8,24}$/;
    if (!regexTelefone.test(value)) throw new Error("Telefone inválido.");
    this._telefone = value;
  }

  public get email(): string {
    return this._email;
  }
  private set email(value: string) {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error("Email inválido.");
    }
    this._email = value;
  }

  public get cidade(): string {
    return this._cidade;
  }
  private set cidade(value: string) {
    this._cidade = value?.trim() ?? '';
  }

  public get dataCriacao(): Date | undefined {
    return this._dataCriacao;
  }

  private set dataCriacao(value: Date | undefined) {
    this._dataCriacao = value;
  }

  public get dataAtualizacao(): Date | undefined {
    return this._dataAtualizacao;
  }

  private set dataAtualizacao(value: Date | undefined) {
    this._dataAtualizacao = value;
  }

  public get dataExclusao(): Date | null | undefined {
    return this._dataExclusao;
  }

  private set dataExclusao(value: Date | null | undefined) {
    this._dataExclusao = value;
  }

  public get status(): StatusCliente | undefined {
    return this._status;
  }

  private set status(value: StatusCliente | undefined) {
    this._status = value;
  }




  public get vendedorResponsavel(): string {
    return this._vendedorResponsavel;
  }
  private set vendedorResponsavel(value: string) {
    if (!value || value.trim() === '') {
      throw new Error("Vendedor responsável é obrigatório.");
    }
    this._vendedorResponsavel = value.trim();
  }
  public get produtos(): Array<Produto> {
    return this._produtos;
  }

  private set produtos(produtos: Array<Produto>) {
    const qtdProdutos = produtos.length;

    if (qtdProdutos < Cliente.QTD_MINIMA_PRODUTOS) {
      throw new ClienteExceptions.QtdMinimaProdutosClienteInvalida();
    }
    this._produtos = produtos;
  }

  // ---------- CONSTRUTOR ----------

  constructor(cliente: ICliente) {
    super (cliente.id);
    this.nome = cliente.nome;
    this.telefone = cliente.telefone;
    this.email = cliente.email ?? '';
    this.cidade = cliente.cidade;
    this.status = cliente.status;
    this.dataCriacao = cliente.dataCriacao;
    this.dataAtualizacao = cliente.dataAtualizacao;
    this.dataExclusao = cliente.dataExclusao;
    this.vendedorResponsavel = cliente.vendedorResponsavel;
    this.produtos = (cliente.produtos ?? []).map(produto => Produto.criarProduto(produto));
  }
  // ---------- CRIA NOVO CLIENTE ----------
    public static criarProduto(props: CriarClienteProps): Cliente {
        return new Cliente(props);
    }

    // ---------- CRIA NOVO CLIENTE ----------

      public static recuperar(props: RecuperarClienteProps): Cliente {
        return new Cliente(props);
    }

  // ---------- MÉTODOS ----------
    public toDTO(): ICliente {
        return ClienteMap.toDTO(this);
    }

    public estaDeletado(): boolean {
        return this.dataExclusao !== null ? true : false;
    }

  // ---------- EXIBE OS DADOS DO CLIENTE ----------
public lerContato(): string {
  const dados = {
    ID: this.id ?? "Não informado",
    Nome: this.nome ?? "Removido",
    Telefone: this.telefone ?? "Removido",
    Email: this.email ?? "Removido",
    Cidade: this.cidade ?? "Removido",
    Cadastrado: this.dataCriacao ? this.dataCriacao.toLocaleString() : "Data não disponível"
  };

  return Object.entries(dados)
    .map(([chave, valor]) => `${chave}: ${valor}`)
    .join("\n")
    .trim();
}
}

export { Cliente };