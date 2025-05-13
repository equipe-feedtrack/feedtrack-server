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
  

   


    // Getters e Setters
    public get id(): string {
        return this._id;
    }
    private set id(value: string) {
        this._id = value;
    }

    public get nome(): string {
        return this._nome;
    }
    private set nome(value: string) {
        this._nome = value;
    }

    public get telefone(): string {
        return this._telefone;
    }
    private set telefone(value: string) {
        this._telefone = value;
    }

    public get email(): string {
        return this._email;
    }
    private set email(value: string) {
        this._email = value;
    }

    public get cidade(): string {
        return this._cidade;
    }
    private set cidade(value: string) {
        this._cidade = value;
    }

    public get dataCadastro(): Date {
        return this._dataCadastro;
    }
    private set dataCadastro(value: Date) {
        this._dataCadastro = value;
    }
    public get ativo(): boolean {
        return this._ativo;
    }
    private set ativo(value: boolean) {
        this._ativo = value;
    }
    public get vendedorResponsavel(): string {
        return this._vendedorResponsavel;
    }
    private set vendedorResponsavel(value: string) {
        this._vendedorResponsavel = value;
    }


    // Construtor: Agora aceitando um objeto do tipo ICliente
    constructor(props: ICliente) {
        this.id = props.id || crypto.randomUUID();  // Gera o id se não vier no objeto
        this.nome = props.nome;
        this.telefone = props.telefone;
        this.email = props.email ?? "";  // Se o email não for informado, coloca um string vazia
        this.cidade = props.cidade;
        this.dataCadastro = props.dataCadastro || new Date();  // Gera a dataCadastro se não vier no objeto
        this.ativo = props.ativo;
        this.vendedorResponsavel = props.vendedorResponsavel;
    }

    // Método: Criar contato
    public static criarContato(props: CriarClienteProps): Cliente {
        return new Cliente({
            ...props, // Passa os dados de CriarClienteProps
            id: crypto.randomUUID(), // Gerar ID automaticamente
            dataCadastro: new Date() // Gerar data de cadastro automaticamente
        });
    }

    // Método: Atualizar contato
    public atualizarContato(dados: Partial<Omit<ICliente, "id" | "dataCadastro">>): void {
        if (dados.nome) this.nome = dados.nome;
        if (dados.telefone) this.telefone = dados.telefone;
        if (dados.email !== undefined) this.email = dados.email;
        if (dados.cidade) this.cidade = dados.cidade;
    }

    // Método: Deletar contato (simulação lógica)
    public deletarContato(): void {
        this.ativo = false; // 🔄 Modificado
      }

    // Método: Ler contato (retorna os dados)
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
    private static validarTelefone() {
        
    }
}

export { Cliente };
