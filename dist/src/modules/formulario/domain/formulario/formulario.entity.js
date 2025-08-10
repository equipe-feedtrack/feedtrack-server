"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formulario = void 0;
const entity_1 = require("@shared/domain/entity");
const formulario_exception_1 = require("./formulario.exception");
class Formulario extends entity_1.Entity {
    get titulo() {
        return this._titulo;
    }
    set titulo(titulo) {
        this._titulo = titulo;
    }
    get descricao() {
        return this._descricao;
    }
    set descricao(descricao) {
        this._descricao = descricao;
    }
    get perguntas() {
        return this._perguntas;
    }
    set perguntas(perguntas) {
        this._perguntas = perguntas;
    }
    get ativo() {
        return this._ativo;
    }
    set ativo(ativo) {
        this._ativo = ativo;
    }
    get dataCriacao() {
        return this._dataCriacao;
    }
    set dataCriacao(dataCriacao) {
        this._dataCriacao = dataCriacao;
    }
    get dataAtualizacao() {
        return this._dataAtualizacao;
    }
    set dataAtualizacao(dataAtualizacao) {
        this._dataAtualizacao = dataAtualizacao;
    }
    get dataExclusao() {
        return this._dataExclusao;
    }
    set dataExclusao(value) {
        this._dataExclusao = value;
    }
    constructor(formulario) {
        super(formulario.id);
        this.titulo = formulario.titulo;
        this.descricao = formulario.descricao;
        this.perguntas = formulario.perguntas;
        this.ativo = formulario.ativo ?? true;
        this.dataCriacao = formulario.dataCriacao ?? new Date();
        this.dataAtualizacao = formulario.dataAtualizacao ?? new Date();
        this.dataExclusao = formulario.dataExclusao ?? null;
        this.validateFormulario();
    }
    // Validações básicas
    validateFormulario() {
        if (!this.titulo || this.titulo.trim().length === 0) {
            throw new formulario_exception_1.FormularioTituloVazioException;
        }
        // Pode colocar outras validações aqui...
    }
    // criar um formulário novo
    static criar(formulario) {
        return new Formulario({
            titulo: formulario.titulo,
            descricao: formulario.descricao,
            perguntas: formulario.perguntas ?? [],
            ativo: formulario.ativo,
            dataCriacao: formulario.dataCriacao,
            dataAtualizacao: formulario.dataAtualizacao
        });
    }
    // recuperar formulário (ex: reconstituir de banco)
    static recuperar(formulario) {
        return new Formulario(formulario);
    }
    ///////////
    //Métodos///
    ///////////
    // Métodos para manipular perguntas
    adicionarPergunta(pergunta) {
        const jaExiste = this.perguntas.some(p => p.id === pergunta.id);
        if (jaExiste) {
            throw new Error("Esta pergunta já existe no formulário.");
        }
        this.perguntas.push(pergunta);
        this.dataAtualizacao = new Date();
    }
    removerPergunta(perguntaId) {
        this.perguntas = this.perguntas.filter(p => p.id !== perguntaId);
        this.dataAtualizacao = new Date();
    }
    // Atualizar título ou descrição
    atualizarTitulo(titulo) {
        if (!titulo || titulo.trim().length < 3) {
            throw new formulario_exception_1.FormularioTituloVazioException;
        }
        this.titulo = titulo;
        this.dataAtualizacao = new Date();
    }
    atualizarDescricao(descricao) {
        this.descricao = descricao;
        this.dataAtualizacao = new Date();
    }
    substituirPerguntas(novasPerguntas) {
        // 1. Regra de negócio (opcional): Garante que um formulário não pode ficar sem perguntas.
        if (!novasPerguntas || novasPerguntas.length === 0) {
            throw new Error("Um formulário deve ter pelo menos uma pergunta.");
        }
        // 3. Substitui a lista antiga pela nova.
        this.perguntas = novasPerguntas;
        // 4. Atualiza a data de modificação.
        this.dataAtualizacao = new Date();
    }
    // Ativar
    ativar() {
        this.ativo = true;
        this.dataAtualizacao = new Date();
    }
    //desativar formulário
    desativar() {
        if (!this.ativo) {
            throw new Error("Este formulário já está inativo.");
        }
        this.ativo = false;
        this.dataAtualizacao = new Date();
        this.dataExclusao = new Date();
        this.perguntas.forEach(pergunta => {
            // Supondo que a entidade Pergunta também tenha um método inativar()
            pergunta.inativar();
        });
    }
}
exports.Formulario = Formulario;
//# sourceMappingURL=formulario.entity.js.map