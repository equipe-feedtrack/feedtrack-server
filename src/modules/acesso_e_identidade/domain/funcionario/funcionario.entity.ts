// src/modules/acesso_e_identidade/domain/funcionario/funcionario.entity.ts

import { Entity } from "@shared/domain/entity";
import { randomUUID } from "crypto";
import { StatusUsuario } from "../usuario/usuario.types";
import { CriarFuncionarioProps, IFuncionario, RecuperarFuncionarioProps } from "./funcionario.types";

// Exceções para Funcionario
export namespace FuncionarioExceptions {
  export class CargoObrigatorioException extends Error {
    constructor() { super("Cargo do funcionário é obrigatório."); this.name = "CargoObrigatorioException"; }
  }
  export class DataAdmissaoInvalidaException extends Error {
    constructor() { super("Data de admissão não pode ser futura."); this.name = "DataAdmissaoInvalidaException"; }
  }
  export class FuncionarioJaInativoException extends Error {
    constructor() { super("Funcionário já está inativo."); this.name = "FuncionarioJaInativoException"; }
  }
}

class Funcionario extends Entity<IFuncionario> implements IFuncionario {
  // Constantes de validação
  public static readonly CARGOS_VALIDOS = [
    'Gerente',
    'Funcionário',
  ];
  public static readonly TAMANHO_MINIMO_CARGO = 3;
  public static readonly TAMANHO_MAXIMO_CARGO = 50;
  public static readonly ANOS_MAXIMO_ADMISSAO = 50;

  // Propriedades da entidade
  private _usuarioId: string;
  private _cargo: string;
  private _dataAdmissao: Date;
  private _status: StatusUsuario;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

  // Getters
  public get usuarioId(): string { return this._usuarioId; }
  public get cargo(): string { return this._cargo; }
  public get dataAdmissao(): Date { return this._dataAdmissao; }
  public get status(): StatusUsuario { return this._status; }
  public get dataCriacao(): Date { return this._dataCriacao; }
  public get dataAtualizacao(): Date { return this._dataAtualizacao; }
  public get dataExclusao(): Date | null { return this._dataExclusao; }

  // Setters privados (com validações)
  private set usuarioId(id: string) {
    if (!id || id.trim() === '') {
      throw new Error("ID de usuário é obrigatório para o funcionário.");
    }
    this._usuarioId = id;
  }
  private set cargo(value: string) {
    const cargoLimpo = value ? value.trim() : '';
    if (!cargoLimpo) {
      throw new FuncionarioExceptions.CargoObrigatorioException();
    }
    if (cargoLimpo.length < Funcionario.TAMANHO_MINIMO_CARGO || cargoLimpo.length > Funcionario.TAMANHO_MAXIMO_CARGO) {
      throw new Error(`O cargo deve ter entre ${Funcionario.TAMANHO_MINIMO_CARGO} e ${Funcionario.TAMANHO_MAXIMO_CARGO} caracteres.`);
    }
    this._cargo = cargoLimpo;
  }
  private set dataAdmissao(value: Date) {
    if (value.getTime() > new Date().getTime()) {
      throw new FuncionarioExceptions.DataAdmissaoInvalidaException();
    }
    this._dataAdmissao = value;
  }
  private set status(value: StatusUsuario) { this._status = value; }
  private set dataCriacao(value: Date) { this._dataCriacao = value; }
  private set dataAtualizacao(value: Date) { this._dataAtualizacao = value; }
  private set dataExclusao(value: Date | null) { this._dataExclusao = value; }

  // Construtor privado
  private constructor(funcionario: IFuncionario) {
    super(funcionario.id);
    this.usuarioId = funcionario.usuarioId;
    this.cargo = funcionario.cargo;
    this.dataAdmissao = funcionario.dataAdmissao;
    this.status = funcionario.status;
    this.dataCriacao = funcionario.dataCriacao;
    this.dataAtualizacao = funcionario.dataAtualizacao;
    this.dataExclusao = funcionario.dataExclusao ?? null;
    this.validarInvariantes();
  }

  // Validação de invariantes da entidade
  private validarInvariantes(): void {
    const dataLimite = new Date();
    dataLimite.setFullYear(dataLimite.getFullYear() - Funcionario.ANOS_MAXIMO_ADMISSAO);
    if (this._dataAdmissao < dataLimite) {
      throw new Error(`Data de admissão é anterior ao limite de ${Funcionario.ANOS_MAXIMO_ADMISSAO} anos.`);
    }
    if (!Funcionario.CARGOS_VALIDOS.includes(this._cargo)) {
      throw new Error(`O cargo "${this._cargo}" não é um cargo válido.`);
    }
  }

  // Métodos de Fábrica (com validação "Fail-Fast")
  public static criarFuncionario(props: CriarFuncionarioProps, id?: string): Funcionario {
    if (!props.usuarioId || props.usuarioId.trim() === '') {
      throw new Error("ID de usuário é obrigatório para criar funcionário.");
    }
    if (!props.cargo || props.cargo.trim() === '') {
      throw new FuncionarioExceptions.CargoObrigatorioException();
    }
    if (props.cargo.trim().length < Funcionario.TAMANHO_MINIMO_CARGO || props.cargo.trim().length > Funcionario.TAMANHO_MAXIMO_CARGO) {
      throw new Error(`O cargo deve ter entre ${Funcionario.TAMANHO_MINIMO_CARGO} e ${Funcionario.TAMANHO_MAXIMO_CARGO} caracteres.`);
    }
    if (!Funcionario.CARGOS_VALIDOS.includes(props.cargo.trim())) {
      throw new Error(`O cargo "${props.cargo}" não é um cargo válido.`);
    }
    if (props.dataAdmissao.getTime() > new Date().getTime()) {
      throw new FuncionarioExceptions.DataAdmissaoInvalidaException();
    }
    const dataLimite = new Date();
    dataLimite.setFullYear(dataLimite.getFullYear() - Funcionario.ANOS_MAXIMO_ADMISSAO);
    if (props.dataAdmissao < dataLimite) {
      throw new Error(`Data de admissão não pode ser anterior a ${Funcionario.ANOS_MAXIMO_ADMISSAO} anos atrás.`);
    }
    const funcionarioCompleto: IFuncionario = {
      id: id || randomUUID(),
      usuarioId: props.usuarioId,
      cargo: props.cargo,
      dataAdmissao: props.dataAdmissao,
      status: StatusUsuario.ATIVO,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };
    return new Funcionario(funcionarioCompleto);
  }

  // Método de fábrica para recuperação de dados persistidos
  public static recuperar(props: RecuperarFuncionarioProps): Funcionario {
    if (!props.id || !props.usuarioId || !props.cargo || !props.dataAdmissao || !props.status || !props.dataCriacao || !props.dataAtualizacao) {
      throw new Error("Dados incompletos para recuperar Funcionário.");
    }
    return new Funcionario(props);
  }

  // Métodos de Comportamento da Entidade
  public alterarCargo(novoCargo: string): void {
    if (this.cargo === novoCargo) {
      throw new Error("Funcionário já possui este cargo.");
    }
    this.cargo = novoCargo;
    this.dataAtualizacao = new Date();
  }

  public ativar(): void {
    if (this.status === StatusUsuario.ATIVO) {
      throw new Error("Funcionário já está ativo.");
    }
    this.status = StatusUsuario.ATIVO;
    this.dataAtualizacao = new Date();
  }

  public inativar(): void {
    if (this.status === StatusUsuario.INATIVO) {
      throw new FuncionarioExceptions.FuncionarioJaInativoException();
    }
    this.status = StatusUsuario.INATIVO;
    this.dataExclusao = new Date();
    this.dataAtualizacao = new Date();
  }
}

export { Funcionario };