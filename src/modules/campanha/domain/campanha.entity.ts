import { Entity } from "@shared/domain/entity";
import { CriarCampanhaProps, ICampanha, RecuperarCampanhaProps, SegmentoAlvo, TipoCampanha } from "./campanha.types";
import { randomUUID } from "crypto";

class Campanha extends Entity<ICampanha> implements ICampanha {
  private _titulo: string;
  private _descricao?: string;
  private _tipoCampanha: TipoCampanha;
  private _segmentoAlvo: SegmentoAlvo;
  private _dataInicio: Date;
  private _dataFim: Date | null;
  private _templateMensagem: string;
  private _formularioId: string;
  private _ativo: boolean;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

  // Getters
  get titulo(): string { return this._titulo; }
  get descricao(): string | undefined { return this._descricao; }
  get tipoCampanha(): TipoCampanha { return this._tipoCampanha; }
  get segmentoAlvo(): SegmentoAlvo { return this._segmentoAlvo; }
  get dataInicio(): Date { return this._dataInicio; }
  get dataFim(): Date | null  { return this._dataFim; }
  get templateMensagem(): string { return this._templateMensagem; }
  get formularioId(): string { return this._formularioId; }
  get ativo(): boolean { return this._ativo; }
  get dataCriacao(): Date { return this._dataCriacao; }
  get dataAtualizacao(): Date { return this._dataAtualizacao; }
  get dataExclusao(): Date | null { return this._dataExclusao; }

  // Setters privados (com validações básicas)
  private set titulo(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Título da campanha não pode ser vazio."); // Ou CampanhaTituloVazioException
    }
    this._titulo = value;
  }
  
  private set descricao(value: string | undefined) { this._descricao = value; }
  
  private set tipoCampanha(value: TipoCampanha) { this._tipoCampanha = value; }
  
  private set segmentoAlvo(value: SegmentoAlvo) { this._segmentoAlvo = value; }
  
  private set dataInicio(value: Date) { this._dataInicio = value; }
  
  private set dataFim(value: Date | null ) { this._dataFim = value; }
  
  private set templateMensagem(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Template da mensagem não pode ser vazio."); // Ou CampanhaTemplateVazioException
    }
    this._templateMensagem = value;
  }

  private set formularioId(value: string) { // Setter para formularioId (obrigatório)
  if (!value || value.trim().length === 0) {
     throw new Error("ID do formulário não pode ser vazio.");
   }
    this._formularioId = value;
  }
  private set ativo(value: boolean) { this._ativo = value; }
  private set dataCriacao(value: Date) { this._dataCriacao = value; }
  private set dataAtualizacao(value: Date) { this._dataAtualizacao = value; }
  private set dataExclusao(value: Date | null) { this._dataExclusao = value; }


  // Construtor privado: Garante que a entidade seja criada em um estado válido
  private constructor(props: ICampanha) {
    super(props.id); // Chamada ao construtor da Entity base
    this.titulo = props.titulo;
    this.descricao = props.descricao;
    this.tipoCampanha = props.tipoCampanha;
    this.segmentoAlvo = props.segmentoAlvo;
    this.dataInicio = props.dataInicio;
    this.dataFim = props.dataFim ?? null;
    this.templateMensagem = props.templateMensagem;
    this.formularioId = props.formularioId;
    this.ativo = props.ativo; // 'ativo' é sempre boolean e será tratado na fábrica
    this.dataCriacao = props.dataCriacao;
    this.dataAtualizacao = props.dataAtualizacao;
    this.dataExclusao = props.dataExclusao ?? null;

    // Validações adicionais após atribuição (ex: dataFim não pode ser anterior a dataInicio)
    this.validarInvariantes();
    }

  // Método para validações complexas da entidade (invariantes)
    private validarInvariantes(): void {
        if (this.dataFim && this.dataFim < this.dataInicio) {
        throw new Error("Data de fim da campanha não pode ser anterior à data de início."); // Ou CampanhaDataInvalidaException
        }
        // Outras validações
    }

        public static criar(props: CriarCampanhaProps, id?: string): Campanha {
        const campanhaCompleta: ICampanha = {
        id: id || randomUUID(),
        titulo: props.titulo,
        descricao: props.descricao,
        tipoCampanha: props.tipoCampanha,
        segmentoAlvo: props.segmentoAlvo,
        dataInicio: props.dataInicio,
        dataFim: props.dataFim ?? null, // Default null se não fornecido na criação
        templateMensagem: props.templateMensagem,
        formularioId: props.formularioId,
        ativo: true, // Nova campanha é ativa por padrão
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        dataExclusao: null,
        };
        return new Campanha(campanhaCompleta);
    }

    public static recuperar(props: RecuperarCampanhaProps): Campanha {
        return new Campanha(props);
    }

   // --- Métodos de Comportamento da Campanha ---
    public ativar(): void {
        if (this.ativo) {
        throw new Error("Campanha já está ativa.");
        }
        this.ativo = true;
        this.dataAtualizacao = new Date();
    }

    public desativar(): void {
        if (!this.ativo) {
        throw new Error("Campanha já está inativa.");
        }
        this.ativo = false;
        this.dataExclusao = new Date();
        this.dataAtualizacao = new Date();
    }

    public atualizarPeriodo(dataInicio: Date, dataFim?: Date): void {
        this.dataInicio = dataInicio;
        this.dataFim = dataFim ?? null;
        this.validarInvariantes(); // Revalida após mudança de datas
        this.dataAtualizacao = new Date();
    }

    public atualizarTemplate(novoTemplate: string): void {
        this.templateMensagem = novoTemplate;
        this.dataAtualizacao = new Date();
    }

}

export {Campanha}