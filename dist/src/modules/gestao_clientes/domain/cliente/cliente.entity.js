"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const cliente_map_1 = require("@modules/gestao_clientes/mappers/cliente.map");
const produto_entity_1 = require("@modules/produtos/domain/produtos/produto.entity");
const entity_1 = require("@shared/domain/entity");
const cliente_exception_1 = require("./cliente.exception");
class Cliente extends entity_1.Entity {
    // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------
    get pessoa() {
        return this._pessoa;
    }
    get cidade() {
        return this._cidade;
    }
    set cidade(value) {
        this._cidade = value?.trim() ?? '';
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
    get vendedorResponsavel() {
        return this._vendedorResponsavel;
    }
    set vendedorResponsavel(value) {
        if (!value || value.trim() === '') {
            throw new Error("Vendedor responsável é obrigatório.");
        }
        this._vendedorResponsavel = value.trim();
    }
    get produtos() {
        return this._produtos;
    }
    set produtos(produtos) {
        const qtdProdutos = produtos.length;
        if (qtdProdutos < Cliente.QTD_MINIMA_PRODUTOS) {
            throw new cliente_exception_1.ClienteExceptions.QtdMinimaProdutosClienteInvalida();
        }
        this._produtos = produtos;
    }
    // ---------- CONSTRUTOR ----------
    constructor(cliente) {
        super(cliente.id); // Vem do Entity.
        this._pessoa = cliente.pessoa; // Vai trazer as informações de Pessoa, agora evitando a repetição de código.
        this.cidade = cliente.cidade;
        this.status = cliente.status;
        this.dataCriacao = cliente.dataCriacao;
        this.dataAtualizacao = cliente.dataAtualizacao;
        this.dataExclusao = cliente.dataExclusao;
        this.vendedorResponsavel = cliente.vendedorResponsavel;
        this.produtos = (cliente.produtos ?? []).map(produto => produto_entity_1.Produto.criarProduto(produto));
    }
    // ---------- CRIA NOVO CLIENTE ----------
    static criarCliente(props) {
        return new Cliente(props);
    }
    // ---------- RECUPERAR CLIENTE ----------
    static recuperar(props) {
        return new Cliente(props);
    }
    // ---------- MÉTODOS ----------
    toDTO() {
        return cliente_map_1.ClienteMap.toDTO(this);
    }
    estaDeletado() {
        return this.dataExclusao !== null ? true : false;
    }
    recuperarDadosEssenciais() {
        return {
            nome: this.pessoa.nome,
            email: this.pessoa.email,
            telefone: this.pessoa.telefone,
            produtos: this.produtos,
            vendedorResponsavel: this.vendedorResponsavel
        };
    }
}
exports.Cliente = Cliente;
// ---------- CONSTANTES -------------------------------
Cliente.QTD_MINIMA_PRODUTOS = 1;
//# sourceMappingURL=cliente.entity.js.map