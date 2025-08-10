"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produto = void 0;
const entity_1 = require("@shared/domain/entity");
const produto_exception_1 = require("./produto.exception");
const crypto_1 = require("crypto");
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
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
    //////////////
    //Construtor//
    //////////////
    constructor(produto) {
        super(produto.id);
        this.nome = produto.nome;
        this.descricao = produto.descricao;
        this.valor = produto.valor;
        this.dataCriacao = produto.dataCriacao;
        this.dataAtualizacao = produto.dataAtualizacao;
        this.dataExclusao = produto.dataExclusao;
        this.ativo = produto.ativo;
    }
    /////////////////////////
    //Static Factory Method//
    /////////////////////////
    static criarProduto(props) {
        const produtoCompleto = {
            id: (0, crypto_1.randomUUID)(), // <-- Geramos o ID aqui
            nome: props.nome,
            descricao: props.descricao,
            valor: props.valor,
            ativo: true,
            dataCriacao: new Date(), // <-- Geramos a data de criação
            dataAtualizacao: new Date(), // <-- Geramos a data de atualização
            dataExclusao: null, // <-- Default para null
        };
        return new Produto(produtoCompleto); // Passa o IProduto completo para o construtor
    }
    static recuperar(props) {
        return new Produto(props);
    }
    ///////////
    //Métodos//
    ///////////
    atualizarNome(novoNome) {
        this.nome = novoNome; // Reutiliza o setter com validação
        this.dataAtualizacao = new Date();
    }
    atualizarDescricao(novaDescricao) {
        this.descricao = novaDescricao; // Reutiliza o setter com validação
        this.dataAtualizacao = new Date();
    }
    atualizarValor(novoValor) {
        this.valor = novoValor; // Reutiliza o setter com validação
        this.dataAtualizacao = new Date();
    }
    ativar() {
        if (this.ativo)
            throw new Error("Produto já está ativo.");
        this.ativo = true;
        this.dataAtualizacao = new Date();
    }
    inativar() {
        if (!this.ativo)
            throw new Error("Produto já está inativo.");
        this.ativo = false;
        this.dataExclusao = new Date(); // Exclusão lógica
        this.dataAtualizacao = new Date();
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
//# sourceMappingURL=produto.entity.js.map