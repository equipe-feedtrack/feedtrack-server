import { ClienteMap } from "@modules/produtos/mappers/cliente.map";
import { Produto } from "@modules/produtos/produto.entity";
import { Entity } from "@shared/domain/entity";
import { Pessoa } from "@shared/domain/pessoa.entity";
import { ClienteExceptions } from "./cliente.exeption";
import { CriarClienteProps, ICliente, RecuperarClienteProps, StatusCliente } from "./cliente.types";

class Cliente extends Entity<ICliente> {

  // -------- ATRIBUTOS DA CLASSE CLIENTE -------
  private _pessoa: Pessoa; // Agora consegue puxar da classe genérica Pessoa
  private _cidade: string;
  private _status?: StatusCliente | undefined;
  private _dataCriacao?: Date | undefined;
  private _dataAtualizacao?: Date | undefined;
  private _dataExclusao?: Date | null | undefined;
  private _vendedorResponsavel: string //Funcionario; // Acredito que o código vai ficar assim com o tipo Funcionário! só tem que fazer os ajustes, não precisa cliente herdar de usuario, quem herda é funcionário é administrador porque Cliente é um domínio, ele tem que está associado a outra classe de dminio chamada de Funcinario (Yago).
  private _produtos: Array<Produto>;


  // ---------- CONSTANTES -------------------------------

  public static readonly QTD_MINIMA_PRODUTOS = 1;


  // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------

    public get pessoa(): Pessoa {
    return this._pessoa;
  }

  private set pessoa(pessoa: Pessoa) {
    this._pessoa = pessoa;
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
    super (cliente.id); // Vem do Entity.
    this.pessoa = new Pessoa({ // Vai trazer as informações de Pessoa, agora evitando a repetição de código.
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone
    });
    this.cidade = cliente.cidade;
    this.status = cliente.status;
    this.dataCriacao = cliente.dataCriacao;
    this.dataAtualizacao = cliente.dataAtualizacao;
    this.dataExclusao = cliente.dataExclusao;
    this.vendedorResponsavel = cliente.vendedorResponsavel;
    this.produtos = (cliente.produtos ?? []).map(produto => Produto.criarProduto(produto));
  }

  // ---------- CRIA NOVO CLIENTE ----------
    public static criarCliente(props: CriarClienteProps): Cliente {
        return new Cliente(props);
    }

    // ---------- RECUPERAR CLIENTE ----------

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
 
  // ---------- EXIBE OS DADOS DO CLIENTE ---------- // NÃO PRECISA PORQUE JÁ RECUPERA OS DADOS ACIMA
// public lerContato(): Cliente {
//   const dados = {
//     ID: this.id ?? "Não informado",
//     Nome: this.nome ?? "Removido",
//     Telefone: this.telefone ?? "Removido",
//     Email: this.email ?? "Removido",
//     Cidade: this.cidade ?? "Removido",
//     Cadastrado: this.dataCriacao ? this.dataCriacao.toLocaleString() : "Data não disponível"
//   };

//   return Object.entries(dados)
//     .map(([chave, valor]) => `${chave}: ${valor}`)
//     .join("\n")
//     .trim();
// }
}

export { Cliente };
