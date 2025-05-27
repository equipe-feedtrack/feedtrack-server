import { PerguntaMap } from "@modules/formulario/mappers/pergunta.map";
import { Entity } from "@shared/domain/entity";
import { OpcaoDuplicadaException, OpcoesObrigatoriasException, PerguntaNaoEncontradaException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException, ValidacaoPerguntaException } from "./pergunta.exception";
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

private set ordem(ordem: number) {
  this._ordem = ordem;
}

 constructor(pergunta: IPergunta) {
    super(pergunta.id)
    this.texto = pergunta.texto;
    this.tipo = pergunta.tipo;
    this.ordem = pergunta.ordem;
    this.opcoes = Pergunta.validarOpcoes(this.tipo, pergunta.opcoes);
  }
private static validarOpcoes(tipo: string, opcoes?: string[]): string[] | undefined {
  switch (tipo) {
    case "texto":
      return this.validarOpcoesTexto(opcoes);
    case "nota":
      return this.validarOpcoesNota(opcoes);
    case "multipla_escolha":
      return this.validarOpcoesMultiplaEscolha(opcoes);
    default:
      throw new TipoPerguntaInvalidoException(tipo);
  }
}

private static validarOpcoesTexto(opcoes?: string[]): undefined {
  if (opcoes !== undefined) {
    throw new ValidacaoPerguntaException();
  }
  return undefined;
}

private static validarOpcoesNota(opcoes?: string[]): string[] {
  const opcoesValidas = opcoes ?? ["1", "2", "3", "4", "5"];

  if (opcoesValidas.length === 0) {
    throw new OpcoesObrigatoriasException();
  }

  const naoNumericas = opcoesValidas.filter(o => isNaN(Number(o)));
  if (naoNumericas.length > 0) {
    throw new ValidacaoPerguntaException();
  }

  return opcoesValidas;
}

private static validarOpcoesMultiplaEscolha(opcoes?: string[]): string[] {
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

private static proximaOrdemLivre(ordensUsadas: number[] = []): number {
  let ordem = 1;
  while (ordensUsadas.includes(ordem)) {
    ordem++;
  }
  return ordem;
}

 public static criar(props: CriarPerguntaProps): Pergunta {
  const { texto, tipo, ordensUsadas, opcoes } = props;

  const opcoesDefinidas = tipo === "texto" ? undefined : opcoes;
  const novaOrdem = Pergunta.proximaOrdemLivre(ordensUsadas);
  return new Pergunta({
    texto,
    tipo,
    opcoes: opcoesDefinidas,
    ordem: novaOrdem
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
    //Métodos///
    ///////////

    public toDTO(): IPergunta {
        return PerguntaMap.toDTO(this);
    }

}

export { Pergunta };