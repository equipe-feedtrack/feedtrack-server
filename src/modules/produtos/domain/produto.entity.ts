import { Entity } from "@shared/domain/entity";
import { ProdutoExceptions } from "./produto.exception";
import { CriarProdutoProps, IProduto, RecuperarProdutoProps } from "./produto.types";
import { randomUUID } from "crypto";

class Produto extends Entity<IProduto> implements IProduto {

    ///////////////////////
    //Atributos de Classe//
    ///////////////////////

    private _nome: string;
    private _descricao: string;
    private _valor: number;
    private _dataCriacao: Date;
    private _dataAtualizacao: Date;
    private _dataExclusao: Date | null ;
    private _ativo: boolean;
    private _empresaId: string;

    //////////////
    //Constantes//
    //////////////

    public static readonly TAMANHO_MINIMO_NOME = 5;
    public static readonly TAMANHO_MAXIMO_NOME = 50;
    public static readonly TAMANHO_MINIMO_DESCRICAO = 10;
    public static readonly TAMANHO_MAXIMO_DESCRICAO = 200;
    public static readonly VALOR_MINIMO = 0;


    ///////////////
    //Gets e Sets//
    ///////////////

    public get nome(): string {
        return this._nome;
    }

    private set nome(nome: string) {

        const tamanhoNome = nome.trim().length;

        if (tamanhoNome < Produto.TAMANHO_MINIMO_NOME) {
            throw new ProdutoExceptions.NomeProdutoTamanhoMinimoInvalido();
        }

        if (tamanhoNome > Produto.TAMANHO_MAXIMO_NOME) {
            throw new ProdutoExceptions.NomeProdutoTamanhoMaximoInvalido();
        }

        this._nome = nome;
    }

    public get descricao(): string {
        return this._descricao;
    }

    private set descricao(descricao: string) {

        const tamanhoDescricao = descricao.trim().length;

        if (tamanhoDescricao < Produto.TAMANHO_MINIMO_DESCRICAO) {
            throw new ProdutoExceptions.DescricaoProdutoTamanhoMinimoInvalido();
        }

        if (tamanhoDescricao > Produto.TAMANHO_MAXIMO_DESCRICAO) {
            throw new ProdutoExceptions.DescricaoProdutoTamanhoMaximoInvalido();
        }

        this._descricao = descricao;
    }

    public get valor(): number {
        return this._valor;
    }

    private set valor(valor: number) {

        if (valor < Produto.VALOR_MINIMO) {
            throw new ProdutoExceptions.ValorMinimoProdutoInvalido();
        }

        this._valor = valor;
    }

    public get dataCriacao(): Date  {
        return this._dataCriacao;
    }

    private set dataCriacao(value: Date) {
        this._dataCriacao = value;
    }

    public get dataAtualizacao(): Date  {
        return this._dataAtualizacao;
    }

    private set dataAtualizacao(value: Date) {
        this._dataAtualizacao = value;
    }

    public get dataExclusao(): Date | null  {
        return this._dataExclusao;
    }

    private set dataExclusao(value: Date | null ) {
        this._dataExclusao = value;
    }

    public get ativo(): boolean  {
        return this._ativo;
    }

    private set ativo(value: boolean ) {
        this._ativo = value;
    }

    public get empresaId(): string {
        return this._empresaId;
    }

    private set empresaId(empresaId: string) {
        this._empresaId = empresaId;
    }

    //////////////
    //Construtor//
    //////////////

    constructor(produto: IProduto) {
        super(produto.id);
        this.nome = produto.nome;
        this.descricao = produto.descricao;
        this.valor = produto.valor;
        this.dataCriacao = produto.dataCriacao;
        this.dataAtualizacao = produto.dataAtualizacao;
        this.dataExclusao = produto.dataExclusao;
        this.ativo = produto.ativo;
        this.empresaId = produto.empresaId;
    }

    /////////////////////////
    //Static Factory Method//
    /////////////////////////

    public static criarProduto(props: CriarProdutoProps): Produto {
        const produtoCompleto: IProduto = { // <-- Construímos um IProduto COMPLEto aqui
        id: randomUUID(), // <-- Geramos o ID aqui
        nome: props.nome,
        descricao: props.descricao,
        valor: props.valor,
        ativo: true,
        empresaId: props.empresaId,
        dataCriacao: new Date(), // <-- Geramos a data de criação
        dataAtualizacao: new Date(), // <-- Geramos a data de atualização
        dataExclusao: null, // <-- Default para null
        };
        return new Produto(produtoCompleto); // Passa o IProduto completo para o construtor
    }

    public static recuperar(props: RecuperarProdutoProps): Produto {
        return new Produto(props);
    }

    ///////////
    //Métodos//
    ///////////

    public atualizarNome(novoNome: string): void {
        this.nome = novoNome; // Reutiliza o setter com validação
        this.dataAtualizacao = new Date();
    }

    public atualizarDescricao(novaDescricao: string): void {
        this.descricao = novaDescricao; // Reutiliza o setter com validação
        this.dataAtualizacao = new Date();
    }

     public atualizarValor(novoValor: number): void {
        this.valor = novoValor; // Reutiliza o setter com validação
        this.dataAtualizacao = new Date();
    }

     public ativar(): void {
        if (this.ativo) throw new Error("Produto já está ativo.");
        this.ativo = true;
        this.dataAtualizacao = new Date();
    }

    public inativar(): void {
        if (!this.ativo) throw new Error("Produto já está inativo.");
        this.ativo = false;
        this.dataExclusao = new Date(); // Exclusão lógica
        this.dataAtualizacao = new Date();
    }

    public estaDeletado(): boolean {
        return this.dataExclusao !== null ? true : false;
    }
}

export { Produto };