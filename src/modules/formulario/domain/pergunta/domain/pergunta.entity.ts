import { Entity } from "@shared/domain/entity";
import { randomUUID } from "crypto";
import { OpcaoDuplicadaException, PerguntaTextoVazioException, QuantidadeMinimaOpcoesException, TipoPerguntaInvalidoException, ValidacaoPerguntaException } from "./pergunta.exception";
import { CriarPerguntaProps, IPergunta, RecuperarPerguntaProps } from "./pergunta.types";


class Pergunta extends Entity<IPergunta> implements IPergunta{

private _texto: string;
private _tipo: string;
  private _ativo: boolean;
  private _opcoes?: string[] | undefined | null;
  private _formularioId: string | undefined;
  private _dataCriacao: Date ;
  private _dataAtualizacao: Date ;
  private _dataExclusao: Date | null;
  
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
  
  public get ativo(): boolean {
    return this._ativo;
  }

  private set ativo(value: boolean) {
    this._ativo = value;
  }
  
  public get opcoes(): string[] | undefined | null {
      return this._opcoes;
    }
    
  private set opcoes(opcoes: string[] | undefined | null) { 
      this._opcoes = opcoes;
    }
  
  public get formularioId(): string | undefined {
    return this._formularioId;
  }

  private set formularioId(value: string | undefined) {
    this._formularioId = value;
  }

    public get dataCriacao(): Date {
      return this._dataCriacao;
    }

    private set dataCriacao(value: Date ) {
      this._dataCriacao = value;
    }

    public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }

  private set dataAtualizacao(value: Date ) {
    this._dataAtualizacao = value;
  }

  public get dataExclusao(): Date | null {
    return this._dataExclusao;
  }
  private set dataExclusao(value: Date | null) {
    this._dataExclusao = value;
  }

  private constructor(pergunta: IPergunta) {
    super(pergunta.id)
    this.texto = pergunta.texto;
    this.tipo = pergunta.tipo;
    this.dataCriacao = pergunta.dataCriacao;
    this.dataAtualizacao = pergunta.dataAtualizacao;
    this.dataExclusao = pergunta.dataExclusao ?? null
    this.opcoes = pergunta.opcoes;
  }
  
  private static validar(tipo: string, opcoes?: string[]): String [] | undefined {
        switch (tipo) {
      case 'texto':
        if (opcoes !== undefined) {
          throw new ValidacaoPerguntaException('Perguntas do tipo texto não devem ter opções.');
        }
        return undefined;

      case 'nota':
        const opcoesDeNota = opcoes ?? ['1', '2', '3', '4', '5'];
        if (opcoesDeNota.some(o => isNaN(Number(o)))) {
          throw new ValidacaoPerguntaException('Opções de nota devem ser apenas números.');
        }
        return opcoesDeNota;

      case 'multipla_escolha':
        if (!opcoes || opcoes.length < 2) {
          throw new QuantidadeMinimaOpcoesException(2);
        }
        const duplicadas = opcoes.filter((item, i) => opcoes.indexOf(item) !== i);
        if (duplicadas.length > 0) {
          throw new OpcaoDuplicadaException(duplicadas[0]);
        }
        return opcoes;

      default:
        // Caso um tipo de pergunta desconhecido seja passado
        throw new TipoPerguntaInvalidoException(tipo);
    }
  }

  public static criar(props: Omit<CriarPerguntaProps, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>, id?: string): Pergunta {
      const perguntaProps: CriarPerguntaProps = {
        ...props,
        id: id || randomUUID(), // Gera um novo ID se não for fornecido
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        dataExclusao: null,
      };

      this.validar(perguntaProps.tipo, perguntaProps.opcoes);; // Valida as regras de negócio
      return new Pergunta(perguntaProps);
    }

  public static recuperar(props: RecuperarPerguntaProps): Pergunta {
     this.validar(props.tipo, props.opcoes);; // Também valida ao recuperar, para garantir consistência
    return new Pergunta(props);
  }

  public vincularFormulario(formularioId: string): void {
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

  public inativar(): void {
    // 1. Regra de negócio: Impede que uma pergunta já inativa seja inativada novamente.
    if (!this.ativo) {
      throw new Error("Esta pergunta já está inativa.");
    }

    // 2. Altera as propriedades para refletir o estado de "excluído".
    this.ativo = false;
    this.dataExclusao = new Date();
    this.dataAtualizacao = new Date(); // A inativação é uma atualização
  }

}
   
export { Pergunta };
