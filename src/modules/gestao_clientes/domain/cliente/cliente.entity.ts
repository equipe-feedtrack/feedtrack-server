import { CriarClienteProps, ICliente } from "./cliente.types";

class Cliente implements ICliente {

    private _id: string;
    private _nome: string;
    private _telefone: string;
    private _email: string;
    private _cidade: string;
    private _dataCadastro: Date;

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

    // Construtor
    constructor(props: CriarClienteProps) {
        this.id = crypto.randomUUID();
        this.nome = props.nome;
        this.telefone = props.telefone;
        this.email = props.email ?? "";
        this.cidade = props.cidade;
        this.dataCadastro = new Date();
    }

    // Método 1: Atualizar dados
    public atualizarDados(dados: Partial<Omit<ICliente, "id" | "dataCadastro">>): void {
        if (dados.nome) this.nome = dados.nome;
        if (dados.telefone) this.telefone = dados.telefone;
        if (dados.email !== undefined) this.email = dados.email;
        if (dados.cidade) this.cidade = dados.cidade;
    }

    // Método 2: Agendar contato
    public agendarContato(): string {
        const dataContato = new Date();
        dataContato.setDate(dataContato.getDate() + 1);
        return `Contato agendado para: ${dataContato.toLocaleString()}`;
    }

    // Método 3 (novo): Validar contato
    public validarContato(): boolean {
        return !!this.telefone && this.telefone.trim().length >= 10;
    }

    // Método 4: Exibir resumo
    public exibirResumo(): string {
        return `
        Cliente: ${this.nome}
        Telefone: ${this.telefone}
        Cidade: ${this.cidade}
        Email: ${this.email || "Não informado"}
        Cadastrado em: ${this.dataCadastro.toLocaleDateString()}
        `.trim();
    }
}

export { Cliente };