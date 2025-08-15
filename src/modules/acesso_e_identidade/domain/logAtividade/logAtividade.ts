import { Entity } from "@shared/domain/entity"; // Sua classe base Entity
import { randomUUID } from "crypto";
import {
  ILogAtividade,
  CriarLogAtividadeProps,
  RecuperarLogAtividadeProps,
  TipoAcao,
  EntidadeAlvoTipo,
} from "./log_atividade.types"; // Seus tipos e enums de LogAtividade
import { TipoUsuario } from "../usuario/usuario.types"; // TipoUsuario do módulo Usuario

// (Se precisar de exceções para LogAtividade, crie um arquivo log_atividade.exception.ts)

class LogAtividade extends Entity<ILogAtividade> implements ILogAtividade {
  private _usuarioId: string;
  private _nomeUsuario: string;
  private _tipoUsuario: TipoUsuario;
  private _acao: TipoAcao;
  private _entidadeAlvoId?: string | null;
  private _entidadeAlvoTipo?: EntidadeAlvoTipo | null;
  private _detalhes?: string | null;
  private _dataOcorrencia: Date;

  // Getters (para expor os dados do log)
  public get usuarioId(): string { return this._usuarioId; }
  public get nomeUsuario(): string { return this._nomeUsuario; }
  public get tipoUsuario(): TipoUsuario { return this._tipoUsuario; }
  public get acao(): TipoAcao { return this._acao; }
  public get entidadeAlvoId(): string | null | undefined { return this._entidadeAlvoId; }
  public get entidadeAlvoTipo(): EntidadeAlvoTipo | null | undefined { return this._entidadeAlvoTipo; }
  public get detalhes(): string | null | undefined { return this._detalhes; }
  public get dataOcorrencia(): Date { return this._dataOcorrencia; }


  // Setters privados (para validação interna no construtor)
  private set usuarioId(value: string) {
    if (!value || value.trim() === '') { throw new Error("ID do usuário é obrigatório para o log."); }
    this._usuarioId = value;
  }
  private set nomeUsuario(value: string) {
    if (!value || value.trim() === '') { throw new Error("Nome do usuário é obrigatório para o log."); }
    this._nomeUsuario = value;
  }
  private set tipoUsuario(value: TipoUsuario) { this._tipoUsuario = value; }
  private set acao(value: TipoAcao) { this._acao = value; }
  private set entidadeAlvoId(value: string | null | undefined) { this._entidadeAlvoId = value ?? null; }
  private set entidadeAlvoTipo(value: EntidadeAlvoTipo | null | undefined) { this._entidadeAlvoTipo = value ?? null; }
  private set detalhes(value: string | null | undefined) { this._detalhes = value ?? null; }
  private set dataOcorrencia(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) { throw new Error("Data de ocorrência inválida para o log."); }
    this._dataOcorrencia = value;
  }

  // Construtor privado (recebe um ILogAtividade completo para construir a entidade)
  private constructor(log: ILogAtividade) {
    super(log.id); // ID é obrigatório
    this.usuarioId = log.usuarioId;
    this.nomeUsuario = log.nomeUsuario;
    this.tipoUsuario = log.tipoUsuario;
    this.acao = log.acao;
    this.entidadeAlvoId = log.entidadeAlvoId;
    this.entidadeAlvoTipo = log.entidadeAlvoTipo;
    this.detalhes = log.detalhes;
    this.dataOcorrencia = log.dataOcorrencia;

    // Validações adicionais (ex: se detalhes é um JSON válido se o tipo for JSON)
    this.validarInvariantes();
  }

  private validarInvariantes(): void {
    // Ex: Garantir que dataOcorrencia não seja no futuro
    if (this.dataOcorrencia.getTime() > new Date().getTime() + 1000) { // Tolerância de 1 segundo
      throw new Error("Data de ocorrência do log não pode ser futura.");
    }
  }


  // Método de fábrica para criar um novo registro de LogAtividade
  public static criar(props: CriarLogAtividadeProps, id?: string): LogAtividade {
    const logCompleto: ILogAtividade = {
      id: id || randomUUID(),
      usuarioId: props.usuarioId,
      nomeUsuario: props.nomeUsuario,
      tipoUsuario: props.tipoUsuario,
      acao: props.acao,
      entidadeAlvoId: props.entidadeAlvoId ?? null,
      entidadeAlvoTipo: props.entidadeAlvoTipo ?? null,
      detalhes: props.detalhes ?? null,
      dataOcorrencia: new Date(), // A data de ocorrência é definida no momento da criação do log
    };
    return new LogAtividade(logCompleto);
  }

  // Método de fábrica para recuperar um registro de LogAtividade do banco
  public static recuperar(props: RecuperarLogAtividadeProps): LogAtividade {
    return new LogAtividade(props);
  }
}

export { LogAtividade };