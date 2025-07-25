"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pergunta = void 0;
const entity_1 = require("@shared/domain/entity");
const pergunta_exception_1 = require("./pergunta.exception");
const crypto_1 = require("crypto");
class Pergunta extends entity_1.Entity {
    get texto() {
        return this._texto;
    }
    set texto(texto) {
        if (!texto || texto.trim() === "") {
            throw new pergunta_exception_1.PerguntaTextoVazioException();
        }
        this._texto = texto;
    }
    get tipo() {
        return this._tipo;
    }
    set tipo(tipo) {
        const tiposValidos = ['nota', 'texto', 'multipla_escolha'];
        if (!tiposValidos.includes(tipo)) {
            throw new pergunta_exception_1.TipoPerguntaInvalidoException(tipo);
        }
        this._tipo = tipo;
        // Limpar opções se o tipo mudar para algo que não seja múltipla escolha
        if (tipo !== 'multipla_escolha') {
            this._opcoes = undefined;
        }
    }
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
    get opcoes() {
        return this._opcoes;
    }
    set opcoes(opcoes) {
        this._opcoes = opcoes;
    }
    get formularioId() {
        return this._formularioId;
    }
    set formularioId(value) {
        this._formularioId = value;
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
    constructor(pergunta) {
        super(pergunta.id);
        this.texto = pergunta.texto;
        this.tipo = pergunta.tipo;
        this.dataCriacao = pergunta.dataCriacao ?? new Date();
        this.dataAtualizacao = pergunta.dataAtualizacao ?? new Date();
        this.dataExclusao = pergunta.dataExclusao ?? null;
        this.opcoes = pergunta.opcoes;
    }
    static validar(tipo, opcoes) {
        switch (tipo) {
            case 'texto':
                if (opcoes !== undefined) {
                    throw new pergunta_exception_1.ValidacaoPerguntaException('Perguntas do tipo texto não devem ter opções.');
                }
                return undefined;
            case 'nota':
                const opcoesDeNota = opcoes ?? ['1', '2', '3', '4', '5'];
                if (opcoesDeNota.some(o => isNaN(Number(o)))) {
                    throw new pergunta_exception_1.ValidacaoPerguntaException('Opções de nota devem ser apenas números.');
                }
                return opcoesDeNota;
            case 'multipla_escolha':
                if (!opcoes || opcoes.length < 2) {
                    throw new pergunta_exception_1.QuantidadeMinimaOpcoesException(2);
                }
                const duplicadas = opcoes.filter((item, i) => opcoes.indexOf(item) !== i);
                if (duplicadas.length > 0) {
                    throw new pergunta_exception_1.OpcaoDuplicadaException(duplicadas[0]);
                }
                return opcoes;
            default:
                // Caso um tipo de pergunta desconhecido seja passado
                throw new pergunta_exception_1.TipoPerguntaInvalidoException(tipo);
        }
    }
    static criar(props, id) {
        let opcoesPreparadas = props.opcoes;
        if (props.tipo === 'nota' && (!opcoesPreparadas || opcoesPreparadas.length === 0)) {
            opcoesPreparadas = ['1', '2', '3', '4', '5'];
        }
        // Para tipo texto, garanta que opcoes seja undefined, não null ou array vazio
        else if (props.tipo === 'texto' && (opcoesPreparadas === null || (Array.isArray(opcoesPreparadas) && opcoesPreparadas.length === 0))) {
            opcoesPreparadas = undefined;
        }
        // Para outros casos onde null foi passado, mas a entidade prefere undefined para ausência
        else if (opcoesPreparadas === null) {
            opcoesPreparadas = undefined;
        }
        const perguntaCompleta = {
            id: id || (0, crypto_1.randomUUID)(),
            texto: props.texto,
            tipo: props.tipo,
            opcoes: opcoesPreparadas,
            formularioId: props.formularioId,
            ativo: true, // Nova pergunta geralmente é ativa
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        this.validar(perguntaCompleta.tipo, perguntaCompleta.opcoes);
        return new Pergunta(perguntaCompleta); // Passa o objeto IPergunta completo
    }
    static recuperar(props) {
        this.validar(props.tipo, props.opcoes);
        ; // Também valida ao recuperar, para garantir consistência
        return new Pergunta(props);
    }
    vincularFormulario(formularioId) {
        // 1. Regra de negócio: Impede que uma pergunta já vinculada seja atribuída a outro formulário.
        // Para reatribuir, seria necessário um método 'desvincular' primeiro.
        if (this.formularioId && this.formularioId !== formularioId) {
            throw new Error("Esta pergunta já está vinculada a outro formulário.");
        }
        // 2. Atribui o ID do formulário.
        this.formularioId = formularioId;
        // 3. A vinculação é uma alteração, então atualizamos a data.
        this.dataAtualizacao = new Date();
    }
    inativar() {
        // 1. Regra de negócio: Impede que uma pergunta já inativa seja inativada novamente.
        console.log('inativar() - Antes: this.ativo =', this.ativo); // Log 1
        if (!this.ativo) {
            throw new Error("Esta pergunta já está inativa.");
        }
        // 2. Altera as propriedades para refletir o estado de "excluído".
        this.ativo = false;
        console.log('inativar() - Depois da atribuição: this.ativo =', this.ativo); // Log 2
        this.dataExclusao = new Date();
        this.dataAtualizacao = new Date(); // A inativação é uma atualização
        console.log('inativar() - Final: this.ativo =', this.ativo); // Log 3
    }
}
exports.Pergunta = Pergunta;
//# sourceMappingURL=pergunta.entity.js.map