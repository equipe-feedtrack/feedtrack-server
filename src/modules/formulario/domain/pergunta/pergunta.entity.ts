import { Entity } from "@shared/domain/entity";
import { OpcaoDuplicadaException, OpcoesObrigatoriasException, PerguntaDuplicadaException, PerguntaNaoEncontradaException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException, ValidacaoPerguntaException } from "./pergunta.exception";
import { CriarPerguntaProps, IPergunta, RecuperarPerguntaProps } from "./pergunta.types";
import { PerguntaMap } from "@modules/formulario/mappers/pergunta.map";

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
    this.ordem = pergunta.ordem;
    this.opcoes = Pergunta.validarOpcoes(this.tipo, pergunta.opcoes);
  }
 private static validarOpcoes(tipo: string, opcoes: string[] | undefined): string[] | undefined {
  if (tipo === "texto") {
    if (opcoes !== undefined) {
      throw new ValidacaoPerguntaException();
    }
    return undefined;
  }

  if (tipo === "nota") {
    const opcoesValidas = opcoes ?? ["1", "2", "3", "4", "5"];

    if (opcoesValidas.length === 0 || opcoesValidas === undefined) {
      throw new OpcoesObrigatoriasException();
    }

    const naoNumericas = opcoesValidas.filter(o => isNaN(Number(o)));
    if (naoNumericas.length > 0) {
      throw new ValidacaoPerguntaException();
    }

    return opcoesValidas;
  }

  if (tipo === "multipla_escolha") {
    if (!opcoes || opcoes.length === 0) {
      throw new OpcoesObrigatoriasException();
    }

    if (opcoes.length < 2) {
      throw new QuantidadeMinimaOpcoesException(2);
    }

    const duplicadas = opcoes.filter((item, i, arr) => arr.indexOf(item) !== i);
    if (duplicadas.length > 0) {
      throw new OpcaoDuplicadaException(duplicadas[0]);
    }

    return opcoes;
  }

  throw new TipoPerguntaInvalidoException(tipo);
}
 public static criar(props: CriarPerguntaProps): Pergunta {
  const { texto, tipo, ordem, opcoes } = props;

  const opcoesDefinidas = tipo === "texto" ? undefined : opcoes;

  return new Pergunta({
    texto,
    tipo,
    opcoes: opcoesDefinidas,
    ordem
  });
}
  public static recuperar(props: RecuperarPerguntaProps): Pergunta {
    const { id, texto, tipo, ordem, opcoes } = props;

    if (!id) {
      throw new PerguntaNaoEncontradaException(id);
    }

    const opcoesDefinidas = tipo === "multipla_escolha" || tipo === "nota" ? opcoes : undefined;

    return new Pergunta({ id, texto, tipo, ordem, opcoes: opcoesDefinidas });
  }

  public static deletar() {
    
  }

   ///////////
    //Métodos//
    ///////////

    public toDTO(): IPergunta {
        return PerguntaMap.toDTO(this);
    }

}

export {Pergunta}