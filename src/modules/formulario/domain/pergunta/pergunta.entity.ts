import { Entity } from "@shared/domain/entity";
import { randomUUID } from "crypto";
import {
  OpcaoDuplicadaException,
  PerguntaTextoVazioException,
  QuantidadeMinimaOpcoesException,
  TipoPerguntaInvalidoException,
  ValidacaoPerguntaException,
} from "./pergunta.exception";
import { CriarPerguntaProps, IPergunta, RecuperarPerguntaProps } from "./pergunta.types";

class Pergunta extends Entity<IPergunta> implements IPergunta {
  private _texto: string;
  private _tipo: string;
  private _ativo: boolean;
  private _opcoes: string[] | null;
  private _empresaId: string;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;
  
  get texto() { return this._texto; }
  set texto(value: string) {
    if (!value || value.trim() === "") {
      throw new PerguntaTextoVazioException();
    }
    this._texto = value;
    this._dataAtualizacao = new Date();
  }

  get tipo() { return this._tipo; }
  set tipo(value: string) {
    const tiposValidos = ["nota", "texto", "multipla_escolha"];
    if (!tiposValidos.includes(value)) {
      throw new TipoPerguntaInvalidoException(value);
    }
    this._tipo = value;
    if (value !== "multipla_escolha") this._opcoes = null;
    this._dataAtualizacao = new Date();
  }

  get opcoes() { return this._opcoes; }
  set opcoes(value: string[] | null) {
    if (this._tipo === "texto" && value !== null) {
      throw new ValidacaoPerguntaException("Perguntas do tipo texto não devem ter opções.");
    }
    if (this._tipo === "nota") {
      this._opcoes = value && value.length > 0 ? value : ["1", "2", "3", "4", "5"];
    } else {
      this._opcoes = value;
    }
    this._dataAtualizacao = new Date();
  }

  get ativo() { return this._ativo; }
  get empresaId() { return this._empresaId; }
  get dataCriacao() { return this._dataCriacao; }
  get dataAtualizacao() { return this._dataAtualizacao; }
  get dataExclusao() { return this._dataExclusao; }
  
  
  constructor(pergunta: IPergunta) {
    super(pergunta.id);

    this._empresaId = pergunta.empresaId;
    this.texto = pergunta.texto;
    this.tipo = pergunta.tipo;
    this._ativo = pergunta.ativo;
    this._opcoes = pergunta.opcoes ?? null;
    this._dataCriacao = pergunta.dataCriacao ?? new Date();
    this._dataAtualizacao = pergunta.dataAtualizacao ?? new Date();
    this._dataExclusao = pergunta.dataExclusao ?? null;
    Pergunta.validator().validarTexto(this.texto);
    Pergunta.validator().validarTipo(this.tipo);
    Pergunta.validator().validarOpcoes(this.opcoes, this.tipo);
  }

  private static validator() {
    // Validações para a criação/atualização de perguntas
    return {
      validarTexto: (texto: string) => {
        if (!texto || texto.trim() === "") {
          throw new PerguntaTextoVazioException();
        }
      },
      validarTipo: (tipo: string) => {
        const tiposValidos = ["nota", "texto", "multipla_escolha"];
        if (!tiposValidos.includes(tipo)) {
          throw new TipoPerguntaInvalidoException(tipo);
        }
      },
      validarOpcoes: (opcoes: string[] | null, tipo: string) => {
        if (tipo === "texto" && opcoes !== null) {
          throw new ValidacaoPerguntaException("Perguntas do tipo texto não devem ter opções.");
        }
        if (tipo === "multipla_escolha" && (!opcoes || opcoes.length < 2)) {
          throw new QuantidadeMinimaOpcoesException(2);
        }
      },
      validarOpcoesDuplicadas: (opcoes: string[] | null) => {
        if (opcoes && new Set(opcoes).size !== opcoes.length) {
          throw new OpcaoDuplicadaException(opcoes.find(opcao => opcoes.indexOf(opcao) !== opcoes.lastIndexOf(opcao)) || "Opção duplicada");
        }
      },

    };
  }


  public static criar(props: CriarPerguntaProps, id?: string): Pergunta {
    const pergunta: IPergunta = {
      id: id ?? randomUUID(),
      texto: props.texto,
      tipo: props.tipo,
      ativo: true,
      empresaId: props.empresaId,
      opcoes: props.opcoes ?? (props.tipo === "nota" ? ["1","2","3","4","5"] : null),
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };
    return new Pergunta(pergunta);
  }

  public static recuperar(props: RecuperarPerguntaProps): Pergunta {
  // Garante que as opções estejam corretas antes de criar a entidade
  const opcoesValidadas = props.opcoes ?? (props.tipo === "nota" ? ["1","2","3","4","5"] : null);

  // Monta o objeto completo para passar ao construtor
  const perguntaCompleta: IPergunta = {
    id: props.id,
    texto: props.texto,
    tipo: props.tipo,
    ativo: props.ativo,
    empresaId: props.empresaId,
    opcoes: opcoesValidadas,
    dataCriacao: props.dataCriacao,
    dataAtualizacao: props.dataAtualizacao,
    dataExclusao: props.dataExclusao ?? null,
  };

  return new Pergunta(perguntaCompleta);
}


  public atualizarTexto(novoTexto: string) {
    this.texto = novoTexto;
  }

  public atualizarTipo(novoTipo: string, novasOpcoes?: string[] | null) {
    this.tipo = novoTipo;
    this.opcoes = novoTipo === "nota" ? (novasOpcoes ?? ["1","2","3","4","5"]) : novasOpcoes ?? null;
  }

  public inativar() {
    if (!this._ativo) throw new Error("Pergunta já está inativa");
    this._ativo = false;
    this._dataExclusao = new Date();
    this._dataAtualizacao = new Date();
  }
}


export { Pergunta };
