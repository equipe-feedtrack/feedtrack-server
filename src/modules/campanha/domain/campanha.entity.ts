import { Entity } from "@shared/domain/entity";
import {
  CriarCampanhaProps,
  ICampanha,
  RecuperarCampanhaProps,
} from "./campanha.types";
import { randomUUID } from "crypto";
import { CanalEnvio } from "@prisma/client";
class Campanha extends Entity<ICampanha> implements ICampanha {
  private _titulo: string;
<<<<<<< HEAD
  private _descricao: string | null;
  private _tipoCampanha: TipoCampanha;
  private _segmentoAlvo: SegmentoAlvo;
  private _dataInicio: Date;
=======
  private _descricao?: string;
>>>>>>> develop
  private _canalEnvio: CanalEnvio;
  private _templateMensagem: string;
  private _formularioId: string;
  private _empresaId: string;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

  // Getters
  get titulo(): string {
    return this._titulo;
  }
  get descricao(): string | null {
    return this._descricao;
  }
  get templateMensagem(): string {
    return this._templateMensagem;
  }
  get formularioId(): string {
    return this._formularioId;
  }
  get empresaId(): string {
    return this._empresaId;
  }
  get dataCriacao(): Date {
    return this._dataCriacao;
  }
  get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }
  get dataExclusao(): Date | null {
    return this._dataExclusao;
  }

  get canalEnvio(): CanalEnvio {
    return this._canalEnvio;
  }

  // Setters privados (com validações)
  private set titulo(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Título da campanha não pode ser vazio."); // Ou CampanhaTituloVazioException
    }
    this._titulo = value;
  }

  private set descricao(value: string | null) {
    this._descricao = value;
  }

private set templateMensagem(value: string) {
  if (!value || value.trim().length === 0) {
    throw new Error("Template da mensagem não pode ser vazio.");
  }
  this._templateMensagem = value;
}


  private set formularioId(value: string) {
    // Setter para formularioId (obrigatório)
    if (!value || value.trim().length === 0) {
      throw new Error("ID do formulário não pode ser vazio.");
    }
    this._formularioId = value;
  }
  private set empresaId(value: string) {
    this._empresaId = value;
  }
  private set dataCriacao(value: Date) {
    this._dataCriacao = value;
  }
  private set dataAtualizacao(value: Date) {
    this._dataAtualizacao = value;
  }
  private set dataExclusao(value: Date | null) {
    this._dataExclusao = value;
  }

  private set canalEnvio(value: CanalEnvio) {
    this._canalEnvio = value;
  }

    private _formulario?: {
    id: string;
    perguntas: { texto: string; tipo: string; opcoes: string[] }[];
  };

  // Getter
  get formulario() {
    return this._formulario;
  }

  // Setter privado
  private set formulario(value: typeof this._formulario) {
    this._formulario = value;
  }

  // Construtor privado: Garante que a entidade seja criada em um estado válido
  private constructor(props: ICampanha) {
    super(props.id); // Chamada ao construtor da Entity base
    this.titulo = props.titulo;
    this.descricao = props.descricao;
    this.templateMensagem = props.templateMensagem ?? '';
    this.formularioId = props.formularioId;
    this.canalEnvio = props.canalEnvio;
    this.empresaId = props.empresaId;
    this.dataCriacao = props.dataCriacao;
    this.dataAtualizacao = props.dataAtualizacao;
    this.dataExclusao = props.dataExclusao ?? null;
    this.canalEnvio = props.canalEnvio || "EMAIL"; // Default canal de envio, pode ser ajustado conforme necessário

  }


  public static criar(props: CriarCampanhaProps, id?: string): Campanha {
    const campanhaCompleta: ICampanha = {
      id: id || randomUUID(),
      titulo: props.titulo,
      descricao: props.descricao,
      canalEnvio: props.canalEnvio || "EMAIL", // Default canal de envio, pode ser ajustado conforme necessário
      templateMensagem: props.templateMensagem,
      formularioId: props.formularioId,
      empresaId: props.empresaId,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };
    return new Campanha(campanhaCompleta);
  }

  public static recuperar(props: RecuperarCampanhaProps): Campanha {
    return new Campanha(props);
  }

}

export { Campanha };