"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campanha = void 0;
const entity_1 = require("@shared/domain/entity");
const crypto_1 = require("crypto");
class Campanha extends entity_1.Entity {
    // Getters
    get titulo() { return this._titulo; }
    get descricao() { return this._descricao; }
    get tipoCampanha() { return this._tipoCampanha; }
    get segmentoAlvo() { return this._segmentoAlvo; }
    get dataInicio() { return this._dataInicio; }
    get dataFim() { return this._dataFim; }
    get templateMensagem() { return this._templateMensagem; }
    get formularioId() { return this._formularioId; }
    get canalEnvio() { return this._canalEnvio; }
    get ativo() { return this._ativo; }
    get dataCriacao() { return this._dataCriacao; }
    get dataAtualizacao() { return this._dataAtualizacao; }
    get dataExclusao() { return this._dataExclusao; }
    // Setters privados (com validações básicas)
    set titulo(value) {
        if (!value || value.trim().length === 0) {
            throw new Error("Título da campanha não pode ser vazio."); // Ou CampanhaTituloVazioException
        }
        this._titulo = value;
    }
    set descricao(value) { this._descricao = value; }
    set tipoCampanha(value) { this._tipoCampanha = value; }
    set segmentoAlvo(value) { this._segmentoAlvo = value; }
    set dataInicio(value) { this._dataInicio = value; }
    set dataFim(value) { this._dataFim = value; }
    set templateMensagem(value) {
        if (!value || value.trim().length === 0) {
            throw new Error("Template da mensagem não pode ser vazio."); // Ou CampanhaTemplateVazioException
        }
        this._templateMensagem = value;
    }
    set formularioId(value) {
        if (!value || value.trim().length === 0) {
            throw new Error("ID do formulário não pode ser vazio.");
        }
        this._formularioId = value;
    }
    set canalEnvio(value) { this._canalEnvio = value; }
    set ativo(value) { this._ativo = value; }
    set dataCriacao(value) { this._dataCriacao = value; }
    set dataAtualizacao(value) { this._dataAtualizacao = value; }
    set dataExclusao(value) { this._dataExclusao = value; }
    // Construtor privado: Garante que a entidade seja criada em um estado válido
    constructor(props) {
        super(props.id); // Chamada ao construtor da Entity base
        this.titulo = props.titulo;
        this.descricao = props.descricao;
        this.tipoCampanha = props.tipoCampanha;
        this.segmentoAlvo = props.segmentoAlvo;
        this.dataInicio = props.dataInicio;
        this.dataFim = props.dataFim ?? null;
        this.templateMensagem = props.templateMensagem;
        this.formularioId = props.formularioId;
        this.canalEnvio = props.canalEnvio;
        this.ativo = props.ativo; // 'ativo' é sempre boolean e será tratado na fábrica
        this.dataCriacao = props.dataCriacao;
        this.dataAtualizacao = props.dataAtualizacao;
        this.dataExclusao = props.dataExclusao ?? null;
        // Validações adicionais após atribuição (ex: dataFim não pode ser anterior a dataInicio)
        this.validarInvariantes();
    }
    // Método para validações complexas da entidade (invariantes)
    validarInvariantes() {
        if (this.dataFim && this.dataFim < this.dataInicio) {
            throw new Error("Data de fim da campanha não pode ser anterior à data de início."); // Ou CampanhaDataInvalidaException
        }
        // Outras validações
    }
    static criar(props, id) {
        const campanhaCompleta = {
            id: id || (0, crypto_1.randomUUID)(),
            titulo: props.titulo,
            descricao: props.descricao,
            tipoCampanha: props.tipoCampanha,
            segmentoAlvo: props.segmentoAlvo,
            dataInicio: props.dataInicio,
            dataFim: props.dataFim ?? null, // Default null se não fornecido na criação
            templateMensagem: props.templateMensagem,
            formularioId: props.formularioId,
            canalEnvio: props.canalEnvio,
            ativo: false, // Nova campanha é ativa por padrão
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        return new Campanha(campanhaCompleta);
    }
    static recuperar(props) {
        return new Campanha(props);
    }
    // --- Métodos de Comportamento da Campanha ---
    ativar() {
        if (this.ativo) {
            throw new Error("Campanha já está ativa.");
        }
        this.ativo = true;
        this.dataAtualizacao = new Date();
    }
    desativar() {
        if (!this.ativo) {
            throw new Error("Campanha já está inativa.");
        }
        this.ativo = false;
        this.dataExclusao = new Date();
        this.dataAtualizacao = new Date();
    }
    atualizarPeriodo(dataInicio, dataFim) {
        this.dataInicio = dataInicio;
        this.dataFim = dataFim ?? null;
        this.validarInvariantes(); // Revalida após mudança de datas
        this.dataAtualizacao = new Date();
    }
    atualizarTemplate(novoTemplate) {
        this.templateMensagem = novoTemplate;
        this.dataAtualizacao = new Date();
    }
}
exports.Campanha = Campanha;
//# sourceMappingURL=campanha.entity.js.map