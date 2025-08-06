import { Entity } from "@shared/domain/entity";
import { Pessoa } from "@shared/domain/pessoa.entity";
import { ClienteExceptions } from "./cliente.exception";
import { randomUUID } from "crypto";
import { Produto } from "@modules/produtos/domain/produto.entity";
import { ClienteEssencial, CriarClienteProps, ICliente, RecuperarClienteProps, StatusCliente } from "./cliente.types";

class Cliente extends Entity<ICliente> {

  // -------- ATRIBUTOS DA CLASSE CLIENTE -------
  private _pessoa: Pessoa; // Agora consegue puxar da classe genérica Pessoa
  private _cidade: string | null;
  private _status: StatusCliente;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date ;
  private _dataExclusao: Date | null ;
  private _vendedorResponsavel: string //Funcionario; // Acredito que o código vai ficar assim com o tipo Funcionário! só tem que fazer os ajustes, não precisa cliente herdar de usuario, quem herda é funcionário é administrador porque Cliente é um domínio, ele tem que está associado a outra classe de dminio chamada de Funcinario (Yago).
  private _produtos: Array<Produto>;
  
  
  // ---------- CONSTANTES -------------------------------
  
  public static readonly QTD_MINIMA_PRODUTOS = 1;
  
  
  // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------
  
  public get pessoa(): Pessoa {
    return this._pessoa;
  }

  private set pessoa(value: Pessoa) {
    this._pessoa = value;
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

  public get vendedorResponsavel(): string {
    return this._vendedorResponsavel;
  }

  private set vendedorResponsavel(vendedorResponsavel: string) {
    if (!vendedorResponsavel || vendedorResponsavel.trim() === '') {
      throw new Error("Vendedor responsável é obrigatório.");
    }
    this._vendedorResponsavel = vendedorResponsavel.trim();
  }
  public get produtos(): Array<Produto> {
  return [...this._produtos];
}

  private set produtos(produtos: Array<Produto>) {
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
    this._produtos = cliente.produtos; 
    this.validarInvariantes();
  }

  private validarInvariantes(): void {
   // --- VALIDAÇÃO CRÍTICA DO TELEFONE AGORA AQUI ---
   if (!this.pessoa.nome || this.pessoa.nome.trim() === '') {
        throw new Error("Nome é obrigatório para criar um Cliente.");
    }  
   
   if (!this.pessoa.telefone || ( this.pessoa.telefone !== 'string' && this.pessoa.telefone === '')) {
     throw new ClienteExceptions.TelefoneObrigatorioParaClienteException();
   } 
   const qtdProdutos = this.produtos.length;
   if (qtdProdutos < Cliente.QTD_MINIMA_PRODUTOS) {
      throw new ClienteExceptions.QtdMinimaProdutosClienteInvalida();
    }


  }

  // ---------- CRIA NOVO CLIENTE ----------
   public static criarCliente(props: CriarClienteProps): Cliente {
        const clienteCompleto: ICliente = { 
            id: randomUUID(),
            pessoa: props.pessoa,
            cidade: props.cidade,
            vendedorResponsavel: props.vendedorResponsavel,
            produtos: props.produtos.map(p => p instanceof Produto ? p : Produto.recuperar(p)),
            status: StatusCliente.ATIVO,
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

      public atualizarCidade(novaCidade: string ): void {
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

    public adicionarProduto(produto: Produto): void {
    if (!this._produtos.some(p => p.id === produto.id)) {
      this._produtos.push(produto);
      this._dataAtualizacao = new Date();
    }
  }

  public removerProduto(produtoId: string): void {
    const totalProdutos = this._produtos.length;
    this._produtos = this._produtos.filter(p => p.id !== produtoId);

    // Se um produto foi realmente removido, atualiza a data.
    if (this._produtos.length < totalProdutos) {
      this._dataAtualizacao = new Date();
    }
  }

    public inativar(): void {
        // Regra de negócio: Um cliente já inativo não pode ser inativado novamente.
        if (this.status === StatusCliente.INATIVO) {
            throw new ClienteExceptions.ClienteJaInativo(this.id);
        }      
        // Altera o status para INATIVO
        this.status = StatusCliente.INATIVO; // Isso chamará o setter 'status' que lida com dataExclusao
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

    public estaDeletado(): boolean {
    return !!this.dataExclusao;
  }

    public recuperarDadosEssenciais(): ClienteEssencial { //Passa apenas as informações essenciais!
    return {
      nome: this.pessoa.nome,
      email: this.pessoa.email ?? '',
      telefone: this.pessoa.telefone ?? '',
      produtos: this.produtos,
      vendedorResponsavel: this.vendedorResponsavel
    };
  }
 
}

export { Cliente };
