"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const entity_1 = require("@shared/domain/entity");
const cliente_exception_1 = require("./cliente.exception");
const crypto_1 = require("crypto");
const produto_entity_1 = require("@modules/produtos/domain/produto.entity");
const cliente_types_1 = require("./cliente.types");
class Cliente extends entity_1.Entity {
    // ---------- GETTERS e SETTERS COM VALIDAÇÃO ----------
    get pessoa() {
        return this._pessoa;
    }
    set pessoa(value) {
        this._pessoa = value;
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
        if (value === cliente_types_1.StatusCliente.INATIVO) {
            this.dataExclusao = new Date();
        }
    }
    get vendedorResponsavel() {
        return this._vendedorResponsavel;
    }
    set vendedorResponsavel(vendedorResponsavel) {
        if (!vendedorResponsavel || vendedorResponsavel.trim() === '') {
            throw new Error("Vendedor responsável é obrigatório.");
        }
        this._vendedorResponsavel = vendedorResponsavel.trim();
    }
    get produtos() {
        return [...this._produtos];
    }
    set produtos(produtos) {
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
        this._produtos = cliente.produtos;
        this.validarInvariantes();
    }
    validarInvariantes() {
        // --- VALIDAÇÃO CRÍTICA DO TELEFONE AGORA AQUI ---
        if (!this.pessoa.nome || this.pessoa.nome.trim() === '') {
            throw new Error("Nome é obrigatório para criar um Cliente.");
        }
        if (!this.pessoa.telefone || (this.pessoa.telefone !== 'string' && this.pessoa.telefone === '')) {
            throw new cliente_exception_1.ClienteExceptions.TelefoneObrigatorioParaClienteException();
        }
        const qtdProdutos = this.produtos.length;
        if (qtdProdutos < Cliente.QTD_MINIMA_PRODUTOS) {
            throw new cliente_exception_1.ClienteExceptions.QtdMinimaProdutosClienteInvalida();
        }
    }
    // ---------- CRIA NOVO CLIENTE ----------
    static criarCliente(props) {
        const clienteCompleto = {
            id: (0, crypto_1.randomUUID)(),
            pessoa: props.pessoa,
            cidade: props.cidade,
            vendedorResponsavel: props.vendedorResponsavel,
            produtos: props.produtos.map(p => p instanceof produto_entity_1.Produto ? p : produto_entity_1.Produto.recuperar(p)),
            status: cliente_types_1.StatusCliente.ATIVO,
            dataCriacao: new Date(), // <-- ADICIONADO: Data de criação gerada
            dataAtualizacao: new Date(), // <-- ADICIONADO: Data de atualização gerada
            dataExclusao: null, // <-- ADICIONADO: Data de exclusão como null por padrão
        };
        // O construtor de Cliente vai mapear os produtos usando Produto.criarProduto
        return new Cliente(clienteCompleto);
    }
    // ---------- RECUPERAR CLIENTE ----------
    static recuperar(props) {
        return new Cliente(props);
    }
    // ---------- MÉTODOS ----------
    atualizarCidade(novaCidade) {
        this.cidade = novaCidade; // Reutiliza o setter
        this.dataAtualizacao = new Date();
    }
    atualizarVendedorResponsavel(novoVendedor) {
        this.vendedorResponsavel = novoVendedor; // Reutiliza o setter
        this.dataAtualizacao = new Date();
    }
    atualizarStatus(novoStatus) {
        if (this.status === novoStatus)
            return;
        this.status = novoStatus; // Reutiliza o setter
        this.dataAtualizacao = new Date();
    }
    adicionarProduto(produto) {
        if (!produto || !produto.id) {
            throw cliente_exception_1.ClienteExceptions.ClienteProdutoIdObrigatorio;
        }
        if (this.produtos.some(p => p.id === produto.id)) {
            throw cliente_exception_1.ClienteExceptions.ClienteProdutoJaTem;
        }
        this.produtos.push(produto);
    }
    removerProduto(produto) {
        const produtoIndex = this._produtos.findIndex(p => p.id === produto.id);
        if (produtoIndex === -1) {
            throw cliente_exception_1.ClienteExceptions.ClienteNaoPossuiProduto;
        }
        this._produtos.splice(produtoIndex, 1);
    }
    /**
     * Edita um produto, substituindo um produto antigo por um novo.
     * @param produtoIdAntigo O ID do produto a ser substituído.
     * @param produtoNovo O objeto do novo produto.
     */
    editarProduto(produtoIdAntigo, produtoNovo) {
        this.removerProduto(produtoIdAntigo);
        this.adicionarProduto(produtoNovo);
    }
    inativar() {
        // Regra de negócio: Um cliente já inativo não pode ser inativado novamente.
        if (this.status === cliente_types_1.StatusCliente.INATIVO) {
            throw new cliente_exception_1.ClienteExceptions.ClienteJaInativo(this.id);
        }
        // Altera o status para INATIVO
        this.status = cliente_types_1.StatusCliente.INATIVO; // Isso chamará o setter 'status' que lida com dataExclusao
        this.dataAtualizacao = new Date();
    }
    reativar() {
        if (this.status === cliente_types_1.StatusCliente.ATIVO) {
            throw new cliente_exception_1.ClienteExceptions.ClienteJaAtivo(this.id);
        }
        this.status = cliente_types_1.StatusCliente.ATIVO; // Isso chamará o setter 'status'
        this.dataExclusao = null; // Remove a data de exclusão
        this.dataAtualizacao = new Date();
    }
    estaDeletado() {
        return !!this.dataExclusao;
    }
    recuperarDadosEssenciais() {
        return {
            nome: this.pessoa.nome,
            email: this.pessoa.email ?? '',
            telefone: this.pessoa.telefone ?? '',
            produtos: this.produtos,
            vendedorResponsavel: this.vendedorResponsavel
        };
    }
}
exports.Cliente = Cliente;
// ---------- CONSTANTES -------------------------------
Cliente.QTD_MINIMA_PRODUTOS = 1;
//# sourceMappingURL=cliente.entity.js.map