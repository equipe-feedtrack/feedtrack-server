import { Entity } from "@shared/domain/entity";
import { OpcaoDuplicadaException, OpcoesObrigatoriasException, PerguntaDuplicadaException, PerguntaNaoEncontradaException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException, ValidacaoPerguntaException } from "./pergunta.exception";
import { CriarPerguntaProps, IPergunta, RecuperarPerguntaProps } from "./pergunta.types";

class Pergunta extends Entity<IPergunta> implements IPergunta{

private _texto: string;
private _tipo: string;
private _opcoes?: string[] | undefined;
private _ordem: number;


get texto(): string {
  return this._texto;
}

private set texto(texto: string) {
  if (!texto || texto.trim() === "") {
    throw new PerguntaTextoVazioException();
  }

  // if (texto === texto) {
  //     throw new PerguntaDuplicadaException();
  // }

  this._texto = texto;
}

get tipo(): string {
  return this._tipo;
}

 private set tipo(tipo) {
   const tiposValidos  =  ['nota', 'texto', 'multipla_escolha'];
  if (!tiposValidos .includes(tipo)) {
    throw new TipoPerguntaInvalidoException(tipo);
  }
  if ((tipo === "multipla_escolha" || tipo === "texto") && tipo.length === 0) {
    throw new OpcoesObrigatoriasException();
  }
  this._tipo = tipo;
  // Limpar opções se o tipo mudar para algo que não seja múltipla escolha
  if (tipo !== 'multipla_escolha') {
    this._opcoes = undefined;
  }
}

public get opcoes(): string[] | undefined {
  return this._opcoes;
}

private set opcoes(opcoes: string[] | undefined) { 
  this._opcoes = opcoes;
}

get ordem(): number {
  return this._ordem;
}

private set ordem(value: number) {
  if (value === undefined || value === null || value < 1) {
    throw new Error('A ordem da pergunta deve ser maior ou igual a 1.');
  }
  this._ordem = value;
}

constructor(pergunta: IPergunta) {
    super(pergunta.id)
    this.texto = pergunta.texto;
    this.tipo = pergunta.tipo;
    this.opcoes = pergunta.opcoes;
    this.ordem = pergunta.ordem;
    Pergunta.validarOpcoes(this.tipo, this.opcoes);
  }

  private static validarOpcoes(tipo: string, opcoes: string[] | undefined): void {

    if ((tipo === "multipla_escolha" && opcoes != undefined)) {
      if (opcoes.length === 0) {
        throw new OpcoesObrigatoriasException();
      };

      if (tipo === "multipla_escolha" && opcoes.length < 2) {
        throw new QuantidadeMinimaOpcoesException(2);
      };

      const duplicadas = opcoes.filter((item, i, arr) => arr.indexOf(item) !== i);
      if (duplicadas.length > 0) {
        throw new OpcaoDuplicadaException(duplicadas[0]);
      };

    }
    
    if (tipo === "nota" && opcoes != undefined && opcoes.length > 0) {
      throw new ValidacaoPerguntaException([
        "Perguntas do tipo 'nota' não devem ter opções."
      ]);
    }

  }

  public static criar(props: CriarPerguntaProps): Pergunta{
    const { texto, tipo, opcoes, ordem } = props;
      return new Pergunta ({texto,
        tipo,
        opcoes,
        ordem});
  }

  public static recuperar(props: RecuperarPerguntaProps): Pergunta {
    
    if(!props.id) {
      throw new PerguntaNaoEncontradaException(props.id);
    };

    return new Pergunta (props);
  }

}

export {Pergunta}