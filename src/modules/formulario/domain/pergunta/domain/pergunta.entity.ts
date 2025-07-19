import { PerguntaMap } from "@modules/formulario/mappers/pergunta.map";
import { Entity } from "@shared/domain/entity";
import { OpcaoDuplicadaException, OpcoesObrigatoriasException, PerguntaNaoEncontradaException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException, ValidacaoPerguntaException } from "./pergunta.exception";
import { CriarPerguntaProps, IPergunta, RecuperarPerguntaProps } from "./pergunta.types";


class Pergunta extends Entity<IPergunta> implements IPergunta{

private _texto: string;
private _tipo: string;
private _opcoes?: string[] | undefined;
private _formularioId: string;
private _dataCriacao?: Date | undefined;
private _dataAtualizacao?: Date | undefined;
private _dataExclusao?: Date | null | undefined;
  
    get texto(): string {
    return this._texto;
    }
  
    private set texto(texto: string) {
    if (!texto || texto.trim() === "") {
      throw new PerguntaTextoVazioException();
    }
      
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
    
   public get formularioId(): string {
    return this._formularioId;
    }

    private set formularioId(value: string) {
      this._formularioId = value;
    }

    public get dataCriacao(): Date | undefined {
      return this._dataCriacao;
    }

    private set dataCriacao(value: Date | undefined) {
      this._dataCriacao = value;
    }

    public get dataAtualizacao(): Date | undefined {
    return this._dataAtualizacao;
  }

  private set dataAtualizacao(value: Date | undefined) {
    this._dataAtualizacao = value;
  }

  public get dataExclusao(): Date | null | undefined {
    return this._dataExclusao;
  }
  private set dataExclusao(value: Date | null | undefined) {
    this._dataExclusao = value;
  }

 constructor(pergunta: IPergunta) {
    super(pergunta.id)
    this.texto = pergunta.texto;
    this.tipo = pergunta.tipo;
    this.formularioId = pergunta.formularioId;
    this.dataCriacao = pergunta.dataCriacao;
    this.dataAtualizacao = pergunta.dataAtualizacao;
    this.dataExclusao = pergunta.dataExclusao ?? null
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

 public static criar(props: CriarPerguntaProps): Pergunta {
  const { id, texto, tipo, opcoes, formularioId } = props;

  const opcoesDefinidas = tipo === "texto" ? undefined : opcoes;
  return new Pergunta({
    id,
    texto,
    tipo,
    opcoes: opcoesDefinidas,
    formularioId, // Vincula como id da Classe formulário
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    dataExclusao: null
  });
}
  public static recuperar(props: RecuperarPerguntaProps): Pergunta {
    const { id, texto, tipo, opcoes, formularioId, dataCriacao, dataAtualizacao, dataExclusao } = props;

    if (!id) {
      throw new PerguntaNaoEncontradaException(id);
    }

    const opcoesDefinidas = tipo === "multipla_escolha" || tipo === "nota" ? opcoes : undefined;

    return new Pergunta({ id, texto, tipo, opcoes: opcoesDefinidas, formularioId, dataCriacao, dataAtualizacao, dataExclusao });
  }

  public static deletar() {
    
  }

    ///////////
    //Métodos///
    ///////////

    toDTO(): IPergunta {
    return {
      id: this.id,
      texto: this._texto,
      tipo: this._tipo,
      opcoes: this._opcoes,
      formularioId: this._formularioId,
      dataCriacao: this._dataCriacao,
      dataAtualizacao: this._dataAtualizacao,
      dataExclusao: this._dataExclusao,
    };
  }
}

export { Pergunta };