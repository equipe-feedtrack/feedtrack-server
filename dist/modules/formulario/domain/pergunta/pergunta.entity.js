"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pergunta = void 0;
const entity_1 = require("@shared/domain/entity");
const pergunta_exception_1 = require("./pergunta.exception");
const pergunta_map_1 = require("@modules/formulario/mappers/pergunta.map");
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
        this.ordem = pergunta.ordem;
        this.opcoes = Pergunta.validarOpcoes(this.tipo, pergunta.opcoes);
    }
    static validarOpcoes(tipo, opcoes) {
        if (tipo === "texto") {
            if (opcoes !== undefined) {
                throw new pergunta_exception_1.ValidacaoPerguntaException();
            }
            return undefined;
        }
        if (tipo === "nota") {
            const opcoesValidas = opcoes ?? ["1", "2", "3", "4", "5"];
            if (opcoesValidas.length === 0 || opcoesValidas === undefined) {
                throw new pergunta_exception_1.OpcoesObrigatoriasException();
            }
            const naoNumericas = opcoesValidas.filter(o => isNaN(Number(o)));
            if (naoNumericas.length > 0) {
                throw new pergunta_exception_1.ValidacaoPerguntaException();
            }
            return opcoesValidas;
        }
        if (tipo === "multipla_escolha") {
            if (!opcoes || opcoes.length === 0) {
                throw new pergunta_exception_1.OpcoesObrigatoriasException();
            }
            if (opcoes.length < 2) {
                throw new pergunta_exception_1.QuantidadeMinimaOpcoesException(2);
            }
            const duplicadas = opcoes.filter((item, i, arr) => arr.indexOf(item) !== i);
            if (duplicadas.length > 0) {
                throw new pergunta_exception_1.OpcaoDuplicadaException(duplicadas[0]);
            }
            return opcoes;
        }
        throw new pergunta_exception_1.TipoPerguntaInvalidoException(tipo);
    }
    static criar(props) {
        const { texto, tipo, ordem, opcoes } = props;
        const opcoesDefinidas = tipo === "texto" ? undefined : opcoes;
        return new Pergunta({
            texto,
            tipo,
            opcoes: opcoesDefinidas,
            ordem
        });
    }
    static recuperar(props) {
        const { id, texto, tipo, ordem, opcoes } = props;
        if (!id) {
            throw new pergunta_exception_1.PerguntaNaoEncontradaException(id);
        }
        const opcoesDefinidas = tipo === "multipla_escolha" || tipo === "nota" ? opcoes : undefined;
        return new Pergunta({ id, texto, tipo, ordem, opcoes: opcoesDefinidas });
    }
    static deletar() {
    }
    ///////////
    //Métodos//
    ///////////
    toDTO() {
        return pergunta_map_1.PerguntaMap.toDTO(this);
    }
}
exports.Pergunta = Pergunta;
//# sourceMappingURL=pergunta.entity.js.map