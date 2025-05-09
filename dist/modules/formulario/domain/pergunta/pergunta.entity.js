"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pergunta = void 0;
const entity_1 = require("@shared/domain/entity");
const pergunta_exception_1 = require("./pergunta.exception");
class Pergunta extends entity_1.Entity {
    get texto() {
        return this._texto;
    }
    set texto(texto) {
        if (!texto || texto.trim() === "") {
            throw new pergunta_exception_1.PerguntaTextoVazioException();
        }
        // if (texto === texto) {
        //     throw new PerguntaDuplicadaException();
        // }
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
        if ((tipo === "multipla_escolha" || tipo === "texto") && tipo.length === 0) {
            throw new pergunta_exception_1.OpcoesObrigatoriasException();
        }
        this._tipo = tipo;
        // Limpar opções se o tipo mudar para algo que não seja múltipla escolha
        if (tipo !== 'multipla_escolha') {
            this._opcoes = undefined;
        }
    }
    get opcoes() {
        return this._opcoes;
    }
    set opcoes(opcoes) {
        this._opcoes = opcoes;
    }
    get ordem() {
        return this._ordem;
    }
    set ordem(value) {
        if (value === undefined || value === null || value < 1) {
            throw new Error('A ordem da pergunta deve ser maior ou igual a 1.');
        }
        this._ordem = value;
    }
    constructor(pergunta) {
        super(pergunta.id);
        this.texto = pergunta.texto;
        this.tipo = pergunta.tipo;
        this.opcoes = pergunta.opcoes;
        this.ordem = pergunta.ordem;
        Pergunta.validarOpcoes(this.tipo, this.opcoes);
    }
    static validarOpcoes(tipo, opcoes) {
        if ((tipo === "multipla_escolha" && opcoes != undefined)) {
            if (opcoes.length === 0) {
                throw new pergunta_exception_1.OpcoesObrigatoriasException();
            }
            ;
            if (tipo === "multipla_escolha" && opcoes.length < 2) {
                throw new pergunta_exception_1.QuantidadeMinimaOpcoesException(2);
            }
            ;
            const duplicadas = opcoes.filter((item, i, arr) => arr.indexOf(item) !== i);
            if (duplicadas.length > 0) {
                throw new pergunta_exception_1.OpcaoDuplicadaException(duplicadas[0]);
            }
            ;
        }
        if (tipo === "nota" && opcoes != undefined && opcoes.length > 0) {
            throw new pergunta_exception_1.ValidacaoPerguntaException([
                "Perguntas do tipo 'nota' não devem ter opções."
            ]);
        }
    }
    static criar(props) {
        const { texto, tipo, opcoes, ordem } = props;
        return new Pergunta({ texto,
            tipo,
            opcoes,
            ordem });
    }
    static recuperar(props) {
        if (!props.id) {
            throw new pergunta_exception_1.PerguntaNaoEncontradaException(props.id);
        }
        ;
        return new Pergunta(props);
    }
}
exports.Pergunta = Pergunta;
//# sourceMappingURL=pergunta.entity.js.map