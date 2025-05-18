import { ICliente, CriarClienteProps } from "./cliente.types";

class Cliente implements ICliente {
  private _id: string;
  private _nome: string;
  private _telefone: string;
  private _email: string;
  private _cidade: string;
  private _dataCadastro: Date;
  private _ativo: boolean = true;
  private _vendedorResponsavel: string;

  // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------

  public get id(): string {
    return this._id;
  }
  private set id(value: string) {
    if (!value) throw new Error("ID é obrigatório.");
    this._id = value;
  }

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

  public get dataCadastro(): Date {
    return this._dataCadastro;
  }
  private set dataCadastro(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("Data de cadastro inválida.");
    }
    this._dataCadastro = value;
  }

  public get ativo(): boolean {
    return this._ativo;
  }
  private set ativo(value: boolean) {
    this._ativo = !!value;
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

  // ---------- CONSTRUTOR ----------

  constructor(props: ICliente) {
    this.id = props.id || crypto.randomUUID(); // Gera ID se não vier
    this.nome = props.nome;
    this.telefone = props.telefone;
    this.email = props.email ?? '';
    this.cidade = props.cidade;
    this.dataCadastro = props.dataCadastro || new Date(); // Data atual se não vier
    this.ativo = props.ativo;
    this.vendedorResponsavel = props.vendedorResponsavel;
  }

  // ---------- CRIA NOVO CLIENTE ----------
  public static criarContato(props: CriarClienteProps): Cliente {
    return new Cliente({
      ...props,
      id: crypto.randomUUID(),
      dataCadastro: new Date(),
      ativo: true,
    });
  }

  // ---------- ATUALIZA DADOS DO CLIENTE ----------
  public atualizarContato(dados: Partial<Omit<ICliente, "id" | "dataCadastro">>): void {
    if (dados.nome) this.nome = dados.nome;
    if (dados.telefone) this.telefone = dados.telefone;
    if (dados.email !== undefined) this.email = dados.email;
    if (dados.cidade) this.cidade = dados.cidade;
    if (dados.vendedorResponsavel) this.vendedorResponsavel = dados.vendedorResponsavel;
    if (dados.ativo !== undefined) this.ativo = dados.ativo;
  }

  // ---------- DESATIVA O CLIENTE (simula deletar) ----------
  public deletarContato(): void {
    this.ativo = false;
  }

  // ---------- EXIBE OS DADOS DO CLIENTE ----------
  public lerContato(): string {
    return `
    ID: ${this.id}
    Nome: ${this.nome || "Removido"}
    Telefone: ${this.telefone || "Removido"}
    Email: ${this.email || "Removido"}
    Cidade: ${this.cidade || "Removido"}
    Cadastrado em: ${this.dataCadastro.toLocaleString()}
        `.trim();
  }
}

export { Cliente };