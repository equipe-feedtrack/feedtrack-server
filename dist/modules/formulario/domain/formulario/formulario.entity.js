"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formulario = void 0;
const pergunta_entity_1 = require("../pergunta/pergunta.entity");
class Formulario {
    get formularioId() {
        return this._formularioId;
    }
    set formularioId(value) {
        this._formularioId = value;
    }
    get titulo() {
        return this._titulo;
    }
    set titulo(value) {
        if (!value) {
            throw new Error('O título do formulário é obrigatório.');
        }
        this._titulo = value;
    }
    get descricao() {
        return this._descricao;
    }
    set descricao(value) {
        this._descricao = value;
    }
    get modeloPadrao() {
        return this._modeloPadrao;
    }
    set modeloPadrao(value) {
        this._modeloPadrao = value;
    }
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
    get dataCriacao() {
        return this._dataCriacao;
    }
    // Não faz sentido ter um setter para data de criação, geralmente é imutável
    get perguntas() {
        return this._perguntas.length > 0 ? this._perguntas : undefined;
    }
    set perguntas(value) {
        this._perguntas = value ?? [];
    }
    // Não implementamos um setter direto para perguntas, use os métodos de manipulação
    get modeloBaseId() {
        return this._modeloBaseId;
    }
    set modeloBaseId(value) {
        this._modeloBaseId = value;
    }
    constructor(formulario) {
        this._perguntas = [];
        this.formularioId = formulario.formularioId ?? Date.now();
        this.titulo = formulario.titulo;
        this.descricao = formulario.descricao;
        this.modeloPadrao = formulario.modeloPadrao;
        this.ativo = formulario.ativo ?? true;
        this._dataCriacao = formulario.dataCriacao ?? new Date();
        this.perguntas = formulario.perguntas;
        this.modeloBaseId = formulario.modeloBaseId;
    }
    adicionarPergunta(pergunta) {
        const novaPergunta = new pergunta_entity_1.Pergunta({
            id: pergunta.id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            opcoes: pergunta.opcoes,
            ordem: pergunta.ordem
        });
        this._perguntas.push(novaPergunta);
    }
    removerPergunta(perguntaId) {
        this._perguntas = this._perguntas.filter((p) => p.id !== perguntaId);
    }
}
exports.Formulario = Formulario;
//# sourceMappingURL=formulario.entity.js.map