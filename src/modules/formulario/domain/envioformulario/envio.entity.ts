import { StatusFormulario } from "@prisma/client";
import { EnvioExceptions, EnvioInvalidoCampanha, EnvioInvalidoCliente, EnvioInvalidoFeedback, EnvioInvalidoFormulario, EnvioInvalidoProduto, EnvioInvalidoUsuario } from "./envio.exceptios";
import { IEnvio } from "./envioFormulario.types";
import { Entity } from "@shared/domain/entity";
import { randomUUID } from "crypto";

export class Envio extends Entity<IEnvio> implements IEnvio {
  private _status: StatusFormulario;
  private _feedbackId: string | null;
  private _clienteId: string;
  private _formularioId: string;
  private _campanhaId: string; // Adicionado para vincular o envio à campanha
  private _usuarioId: string;
  private _produtoId: string;
  private _empresaId: string;
  private _dataCriacao: Date;
  private _dataEnvio: Date | null;
  private _tentativasEnvio: number;
  private _ultimaMensagemErro: string | null;

  // Getters
  get status(): StatusFormulario { return this._status; }
  get feedbackId(): string | null { return this._feedbackId; }
  get clienteId(): string { return this._clienteId; }
  get formularioId(): string { return this._formularioId; }
  get campanhaId(): string { return this._campanhaId; } // Getter para o ID da campanha
  get usuarioId(): string { return this._usuarioId; }
  get produtoId(): string { return this._produtoId; }
  get empresaId(): string { return this._empresaId; }
  get dataCriacao(): Date { return this._dataCriacao; }
  get dataEnvio(): Date | null { return this._dataEnvio; }
  get tentativasEnvio(): number { return this._tentativasEnvio; }
  get ultimaMensagemErro(): string | null { return this._ultimaMensagemErro; }

  // Construtor privado
  private constructor(props: IEnvio, id?: string) {
    super(id);
    this._status = props.status;
    this._feedbackId = props.feedbackId;
    this._clienteId = props.clienteId;
    this._formularioId = props.formularioId;
    this._campanhaId = props.campanhaId;
    this._usuarioId = props.usuarioId;
    this._produtoId = props.produtoId;
    this._dataCriacao = props.dataCriacao;
    this._dataEnvio = props.dataEnvio;
    this._tentativasEnvio = props.tentativasEnvio;
    this._ultimaMensagemErro = props.ultimaMensagemErro;

    this.validarInvariantes();
  }

  public static criar(props: Omit<IEnvio, 'id' | 'status' | 'dataCriacao' | 'dataEnvio' | 'tentativasEnvio' | 'ultimaMensagemErro' | 'feedbackId'>, id?: string): Envio {
    const propsCompletas: IEnvio = {
      ...props,
      id: id || randomUUID(),
      status: StatusFormulario.PENDENTE,
      dataCriacao: new Date(),
      dataEnvio: null,
      tentativasEnvio: 0,
      ultimaMensagemErro: null,
      feedbackId: null,
    };
    return new Envio(propsCompletas);
  }

  public static recuperar(props: IEnvio, id: string): Envio {
    if (!id) {
      throw new EnvioExceptions
    }
    return new Envio(props, id);
  }

  private validarInvariantes(): void {
    if (!this.clienteId) {
      throw new EnvioInvalidoCliente
    }
    if (!this.formularioId) {
      throw new EnvioInvalidoFormulario
    }
    if (!this.campanhaId) {
      throw new EnvioInvalidoCampanha
    }
    if (!this.usuarioId) {
      throw new EnvioInvalidoUsuario
    }
    if (!this.produtoId) {
      throw new EnvioInvalidoProduto
    }
  }

  public marcarComoEnviado(): void {
    this._status = StatusFormulario.ENVIADO;
    this._dataEnvio = new Date();
    this._ultimaMensagemErro = null;
  }

  public registrarFalha(mensagemErro: string): void {
    this._status = StatusFormulario.FALHA;
    this._tentativasEnvio += 1;
    this._ultimaMensagemErro = mensagemErro;
  }

  public associarFeedback(feedbackId: string): void {
    if (!feedbackId) {
      throw new EnvioInvalidoFeedback
    }
    this._feedbackId = feedbackId;
  }
}
