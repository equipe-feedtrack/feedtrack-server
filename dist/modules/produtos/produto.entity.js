"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produto = void 0;
const entity_1 = require("../../shared/domain/entity");
const produto_exception_1 = require("./produto.exception");
const produto_map_1 = require("modules/mappers/produto.map");
class Produto extends entity_1.Entity {
    ///////////////
    //Gets e Sets//
    ///////////////
    get nome() {
        return this._nome;
    }
    set nome(nome) {
        const tamanhoNome = nome.trim().length;
        if (tamanhoNome < Produto.TAMANHO_MINIMO_NOME) {
            throw new produto_exception_1.ProdutoExceptions.NomeProdutoTamanhoMinimoInvalido();
        }
        if (tamanhoNome > Produto.TAMANHO_MAXIMO_NOME) {
            throw new produto_exception_1.ProdutoExceptions.NomeProdutoTamanhoMaximoInvalido();
        }
        this._nome = nome;
    }
    get descricao() {
        return this._descricao;
    }
    set descricao(descricao) {
        const tamanhoDescricao = descricao.trim().length;
        if (tamanhoDescricao < Produto.TAMANHO_MINIMO_DESCRICAO) {
            throw new produto_exception_1.ProdutoExceptions.DescricaoProdutoTamanhoMinimoInvalido();
        }
        if (tamanhoDescricao > Produto.TAMANHO_MAXIMO_DESCRICAO) {
            throw new produto_exception_1.ProdutoExceptions.DescricaoProdutoTamanhoMaximoInvalido();
        }
        this._descricao = descricao;
    }
    get valor() {
        return this._valor;
    }
    set valor(valor) {
        if (valor < Produto.VALOR_MINIMO) {
            throw new produto_exception_1.ProdutoExceptions.ValorMinimoProdutoInvalido();
        }
        this._valor = valor;
    }
    get estoque() {
        return this._estoque;
    }
    set estoque(estoque) {
        if (estoque < Produto.ESTOQUE_MINIMO) {
            throw new produto_exception_1.ProdutoExceptions.EstoqueMinimoProdutoInvalido();
        }
        this._estoque = estoque;
    }
    get dataCriacao() {
        return this._dataCriacao;
    }
    set dataCriacao(value) {
        this._dataCriacao = value;
    }
    get dataAtualizacao() {
        return this._dataAtualizacao;
    }
    set dataAtualizacao(value) {
        this._dataAtualizacao = value;
    }
    get dataExclusao() {
        return this._dataExclusao;
    }
    set dataExclusao(value) {
        this._dataExclusao = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    //////////////
    //Construtor//
    //////////////
    constructor(produto) {
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
    static criar(props) {
        return new Produto(props);
    }
    static recuperar(props) {
        return new Produto(props);
    }
    ///////////
    //Métodos//
    ///////////
    toDTO() {
        return produto_map_1.ProdutoMap.toDTO(this);
    }
    estaDeletado() {
        return this.dataExclusao !== null ? true : false;
    }
}
exports.Produto = Produto;
//////////////
//Constantes//
//////////////
Produto.TAMANHO_MINIMO_NOME = 5;
Produto.TAMANHO_MAXIMO_NOME = 50;
Produto.TAMANHO_MINIMO_DESCRICAO = 10;
Produto.TAMANHO_MAXIMO_DESCRICAO = 200;
Produto.VALOR_MINIMO = 0;
Produto.ESTOQUE_MINIMO = 0;
//# sourceMappingURL=produto.entity.js.map