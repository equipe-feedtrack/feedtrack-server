import { Entity } from "@shared/domain/entity";
import { Pessoa } from "@shared/domain/pessoa.entity";
import { ClienteExceptions } from "./cliente.exception";
import { randomUUID } from "crypto";
import { Produto } from "@modules/produtos/domain/produto.entity";
import { ClienteEssencial, CriarClienteProps, ICliente, RecuperarClienteProps, StatusCliente } from "./cliente.types";

class Cliente extends Entity<ICliente> {

  // -------- ATRIBUTOS DA CLASSE CLIENTE -------
  private _pessoa: Pessoa; // Agora consegue puxar da classe genérica Pessoa
  private _cidade: string;
  private _status?: StatusCliente;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date ;
  private _dataExclusao?: Date | null ;
  private _vendedorResponsavel: string //Funcionario; // Acredito que o código vai ficar assim com o tipo Funcionário! só tem que fazer os ajustes, não precisa cliente herdar de usuario, quem herda é funcionário é administrador porque Cliente é um domínio, ele tem que está associado a outra classe de dminio chamada de Funcinario (Yago).
  private _produtos: Array<Produto>;
  
  
  // ---------- CONSTANTES -------------------------------
  
  public static readonly QTD_MINIMA_PRODUTOS = 1;
  
  
  // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------
  
  public get pessoa(): Pessoa {
    return this._pessoa;
  }

  public set pessoa(value: Pessoa) {
    
    if (!this.pessoa.nome || this.pessoa.nome.trim() === '') {
        throw new Error("Nome é obrigatório para criar uma Pessoa.");
    } 
    
    if (!this._pessoa.telefone || typeof this._pessoa.telefone !== 'string' || this._pessoa.telefone.trim() === '') {
      throw new ClienteExceptions.TelefoneObrigatorioParaClienteException();
    }
    this._pessoa = value;
  }

  public get cidade(): string | undefined {
    return this._cidade;
  }

  private set cidade(value: string | undefined) {
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
    this._pessoa = cliente.pessoa; // Vai trazer as informações de Pessoa, agora evitando a repetição de código.
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
        const clienteCompleto: ICliente = { 
           id: randomUUID(),
            pessoa: props.pessoa,
            cidade: props.cidade,
            vendedorResponsavel: props.vendedorResponsavel,
            status: props.status ?? StatusCliente.ATIVO, // Status padrão
            produtos: props.produtos, // Produtos vêm de props, serão mapeados no construtor
            dataCriacao: new Date(), // <-- ADICIONADO: Data de criação gerada
            dataAtualizacao: new Date(), // <-- ADICIONADO: Data de atualização gerada
            dataExclusao: null, // <-- ADICIONADO: Data de exclusão como null por padrão
        };
        // O construtor de Cliente vai mapear os produtos usando Produto.criarProduto
        return new Cliente(clienteCompleto);
    }

    // ---------- RECUPERAR CLIENTE ----------
      public static recuperar(props: RecuperarClienteProps): Cliente {
        return new Cliente(props);
    }

  // ---------- MÉTODOS ----------

      public atualizarCidade(novaCidade: string | undefined): void {
        this.cidade = novaCidade; // Reutiliza o setter
        this.dataAtualizacao = new Date();
    }

    public atualizarVendedorResponsavel(novoVendedor: string): void {
    this.vendedorResponsavel = novoVendedor; // Reutiliza o setter
    this.dataAtualizacao = new Date();
    } 

    public atualizarStatus(novoStatus: StatusCliente): void {
        if (this.status === novoStatus) return;
        this.status = novoStatus; // Reutiliza o setter
        this.dataAtualizacao = new Date();
    }

    public inativar(): void {
        // Regra de negócio: Um cliente já inativo não pode ser inativado novamente.
        if (this.status === StatusCliente.INATIVO) {
            throw new ClienteExceptions.ClienteJaInativo(this.id);
        }      

        // Altera o status para INATIVO
        this.status = StatusCliente.INATIVO; // Isso chamará o setter 'status' que lida com dataExclusao
        
        // Assegura que dataExclusao e dataAtualizacao são atualizadas (se o setter de status não o fizer)
        if (!this.dataExclusao) { // Só seta se ainda não tiver sido setado pelo setter de status
            this.dataExclusao = new Date();
        }
        this.dataAtualizacao = new Date(); 
    }

    public reativar(): void {
        if (this.status === StatusCliente.ATIVO) {
            throw new ClienteExceptions.ClienteJaAtivo(this.id);
        }
        this.status = StatusCliente.ATIVO; // Isso chamará o setter 'status'
        this.dataExclusao = null; // Remove a data de exclusão
        this.dataAtualizacao = new Date();
    }

    public recuperarDadosEssenciais(): ClienteEssencial { //Passa apenas as informações essenciais!
    return {
      nome: this.pessoa.nome,
      email: this.pessoa.email,
      telefone: this.pessoa.telefone ?? '',
      produtos: this.produtos,
      vendedorResponsavel: this.vendedorResponsavel
    };
  }
 
}

export { Cliente };
