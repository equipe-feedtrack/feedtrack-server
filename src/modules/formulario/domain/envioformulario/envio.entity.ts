import { StatusFormulario } from "@prisma/client";
import { EnvioExceptions } from "./envio.exceptios";
import { IEnvio } from "./envioFormulario.types";
import { Entity } from "@shared/domain/entity";
import { randomUUID } from "crypto";

export class Envio extends Entity<IEnvio> implements IEnvio {
  private _status: StatusFormulario;
  private _campanhaId: string; // Adicionado para vincular o envio à campanha
  private _empresaId: string;
  private _vendaId: string;
  private _dataCriacao: Date;
  private _dataEnvio: Date | null;
  private _tentativasEnvio: number;
  private _ultimaMensagemErro: string | null;

  // Getters
  get vendaId(): string { return this._vendaId; }
  get status(): StatusFormulario { return this._status; }
  get campanhaId(): string { return this._campanhaId; } // Getter para o ID da campanha
  get empresaId(): string { return this._empresaId; }
  get dataCriacao(): Date { return this._dataCriacao; }
  get dataEnvio(): Date | null { return this._dataEnvio; }
  get tentativasEnvio(): number { return this._tentativasEnvio; }
  get ultimaMensagemErro(): string | null { return this._ultimaMensagemErro; }

  // Construtor privado
  private constructor(props: IEnvio, id?: string) {
    super(id);
    this._status = props.status;
    this._empresaId = props.empresaId;
    this._vendaId = props.vendaId;
    this._campanhaId = props.campanhaId;
    this._dataCriacao = props.dataCriacao;
    this._dataEnvio = props.dataEnvio;
    this._tentativasEnvio = props.tentativasEnvio;
    this._ultimaMensagemErro = props.ultimaMensagemErro;

    // this.validarInvariantes();
  }

  public static criar(props: Omit<IEnvio, 'id' | 'status' | 'dataCriacao' | 'dataEnvio' | 'tentativasEnvio' | 'ultimaMensagemErro' >, id?: string): Envio {
    const propsCompletas: IEnvio = {
      ...props,
      id: id || randomUUID(),
      vendaId: props.vendaId,
      campanhaId: props.campanhaId,
      empresaId: props.empresaId,
      status: StatusFormulario.PENDENTE,
      dataCriacao: new Date(),
      dataEnvio: null,
      tentativasEnvio: 0,
      ultimaMensagemErro: null,
    };
    return new Envio(propsCompletas);
  }

  public static recuperar(props: IEnvio, id: string): Envio {
    if (!id) {
      throw new EnvioExceptions
    }
    return new Envio(props, id);
  }

  // private validarInvariantes(): void {
  //   if (!this.campanhaId) {
  //     throw new EnvioInvalidoCampanha
  //   }
  //   if (!this.empresaId) {
  //     throw new EnvioInvalidoCliente
  //   }
  //   if (!this.dataCriacao) {
  //     throw new EnvioInvalidoFormulario
  //   }
  //   if (!this.status) {
  //     throw new EnvioInvalidoUsuario
  //   }
  //   if (!this.tentativasEnvio) {
  //     throw new EnvioInvalidoProduto
  //   }
  //   if (!this.ultimaMensagemErro) {
  //     throw new EnvioInvalidoFeedback
  //   }

  // }

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


}
