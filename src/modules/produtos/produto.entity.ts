import { ProdutoMap } from "@modules/produtos/mappers/produto.map";
import { Entity } from "../../shared/domain/entity";
import { ProdutoExceptions } from "./produto.exception";
import { CriarProdutoProps, IProduto, RecuperarProdutoProps, StatusProduto } from "./produto.types";

class Produto extends Entity<IProduto> implements IProduto {

    ///////////////////////
    //Atributos de Classe//
    ///////////////////////

    private _nome: string;
    private _descricao: string;
    private _valor: number;
    private _estoque: number;
    private _dataCriacao?: Date | undefined;
    private _dataAtualizacao?: Date | undefined;
    private _dataExclusao?: Date | null | undefined;
    private _status?: StatusProduto | undefined;

    //////////////
    //Constantes//
    //////////////

    public static readonly TAMANHO_MINIMO_NOME = 5;
    public static readonly TAMANHO_MAXIMO_NOME = 50;
    public static readonly TAMANHO_MINIMO_DESCRICAO = 10;
    public static readonly TAMANHO_MAXIMO_DESCRICAO = 200;
    public static readonly VALOR_MINIMO = 0;
    public static readonly ESTOQUE_MINIMO = 0;

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

    public get estoque(): number {
        return this._estoque;
    }

    private set estoque(estoque: number) {

        if (estoque < Produto.ESTOQUE_MINIMO) {
            throw new ProdutoExceptions.EstoqueMinimoProdutoInvalido();
        }

        this._estoque = estoque;
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

    public get status(): StatusProduto | undefined {
        return this._status;
    }

    private set status(value: StatusProduto | undefined) {
        this._status = value;
    }

    //////////////
    //Construtor//
    //////////////

    private constructor(produto: IProduto) {

        super(produto.id);
        this.nome = produto.nome;
        this.descricao = produto.descricao;
        this.valor = produto.valor;
        this.estoque = produto.estoque;
        this.dataCriacao = produto.dataCriacao;
        this.dataAtualizacao = produto.dataAtualizacao;
        this.dataExclusao = produto.dataExclusao;
        this.status = produto.status;
    }

    /////////////////////////
    //Static Factory Method//
    /////////////////////////

    public static criar(props: CriarProdutoProps): Produto {
        return new Produto(props);
    }

    public static recuperar(props: RecuperarProdutoProps): Produto {
        return new Produto(props);
    }

    ///////////
    //Métodos//
    ///////////

    public toDTO(): IProduto {
        return ProdutoMap.toDTO(this);
    }

    public estaDeletado(): boolean {
        return this.dataExclusao !== null ? true : false;
    }
}

export { Produto };
