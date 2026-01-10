// src/modules/acesso_e_identidade/domain/funcionario/funcionario.entity.ts

import { Entity } from "@shared/domain/entity";
import { Pessoa} from "@shared/domain/pessoa.entity"; // Entidade Pessoa
import { randomUUID } from "crypto"; // Para gerar IDs
import { StatusUsuario } from "../usuario/usuario.types"; // O enum StatusUsuario
import {CriarFuncionarioProps,IFuncionario, RecuperarFuncionarioProps} from "./funcionario.types";

// Exceções para Funcionario (crie um arquivo funcionario.exception.ts se necessário)
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
  private _usuarioId: string; // Referência ao ID do Usuario
  private _cargo: string;
  private _dataAdmissao: Date | null; // Data de admissão (pode ser nula se não for obrigatório)
  private _status: StatusUsuario; // Status do funcionário
  private _empresaId: string;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

  // Getters
  public get usuarioId(): string { return this._usuarioId; }
  public get cargo(): string { return this._cargo; }
  public get dataAdmissao(): Date | null { return this._dataAdmissao; }
  public get status(): StatusUsuario { return this._status; }
  public get empresaId(): string { return this._empresaId; }
  public get dataCriacao(): Date { return this._dataCriacao; }
  public get dataAtualizacao(): Date { return this._dataAtualizacao; }
  public get dataExclusao(): Date | null { return this._dataExclusao; }


  private set usuarioId(id: string) {
    if (!id || id.trim() === '') {
      throw new Error("ID de usuário é obrigatório para o funcionário.");
    }
    this._usuarioId = id;
  }

  private set cargo(value: string) {
    if (!value || value.trim() === '') {
      throw new FuncionarioExceptions.CargoObrigatorioException();
    }
    this._cargo = value.trim();
  }

private set dataAdmissao(value: Date | null | undefined) {
  if (value != null && value.getTime() > new Date().getTime()) {
    throw new FuncionarioExceptions.DataAdmissaoInvalidaException();
  }
  this._dataAdmissao = value ?? null;
}



  private set status(value: StatusUsuario) { this._status = value; }
  private set empresaId(value: string) { this._empresaId = value; }
  private set dataCriacao(value: Date) { this._dataCriacao = value; }
  private set dataAtualizacao(value: Date) { this._dataAtualizacao = value; }
  private set dataExclusao(value: Date | null) { this._dataExclusao = value; }

  constructor(funcionario: IFuncionario) {
    super(funcionario.id);
    this.usuarioId = funcionario.usuarioId; 
    this.cargo = funcionario.cargo;
    this.dataAdmissao = funcionario.dataAdmissao ;
    this.status = funcionario.status; 
    this.empresaId = funcionario.empresaId;
    this.dataCriacao = funcionario.dataCriacao;
    this.dataAtualizacao = funcionario.dataAtualizacao;
    this.dataExclusao = funcionario.dataExclusao ?? null;
    this.validarInvariantes();
  }


  private validarInvariantes(): void {
    // Ex: Data de admissão não pode ser muito antiga (regra de negócio)
    // Ex: Validação de cargo específico
  }

  // Métodos de Fábrica (Static Factory Methods)
  public static criarFuncionario(props: CriarFuncionarioProps, id?: string): Funcionario {
    // Validações essenciais antes de construir o objeto completo
    if (!props.usuarioId || props.usuarioId.trim() === '') {
      throw new Error("ID de usuário é obrigatório para criar funcionário.");
    }
    if (!props.cargo || props.cargo.trim() === '') {
      throw new FuncionarioExceptions.CargoObrigatorioException();
    }


    

    const funcionarioCompleto: IFuncionario = {
      id: id || randomUUID(), // ID é gerado aqui se não for fornecido
      usuarioId: props.usuarioId,
      cargo: props.cargo,
      dataAdmissao: props.dataAdmissao,
      status: StatusUsuario.ATIVO,
      empresaId: props.empresaId,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };
    return new Funcionario(funcionarioCompleto);
  }

  toJSON(): IFuncionario{
    return{
      id: this.id,
      usuarioId: this.usuarioId,
      cargo: this.cargo,
      dataAdmissao: this.dataAdmissao,
      status: this.status,
      empresaId: this.empresaId,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
      dataExclusao: this.dataExclusao
    }
  }

  public static recuperar(props: RecuperarFuncionarioProps): Funcionario {
    // O Prisma/Mapper deve garantir que todos os campos de IFuncionario estejam presentes e válidos
    if (!props.id || !props.usuarioId || !props.cargo || !props.dataAdmissao === undefined || !props.status || !props.dataCriacao || !props.dataAtualizacao || props.dataExclusao === undefined || !props.empresaId) {
      throw new Error("Dados incompletos para recuperar Funcionário."); // Exceção de recuperação
    }


    // Adicione mais validações ao recuperar se o construtor for mais flexível
    return new Funcionario(props);
  }

  // --- Métodos de Comportamento da Entidade ---
  public alterarCargo(novoCargo: string): void {
    if (this.cargo === novoCargo) {
      throw new Error("Funcionário já possui este cargo.");
    }
    this.cargo = novoCargo; // Usa setter para validar
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
    this.dataExclusao = new Date(); // Marca a data de inativação/exclusão lógica
    this.dataAtualizacao = new Date();
  }

  // Método para atualizar a data de admissão (ex: correção de erro, sem validação futura)
  public corrigirDataAdmissao(novaData: Date): void {
    if (novaData.getTime() > new Date().getTime()) {
      throw new FuncionarioExceptions.DataAdmissaoInvalidaException(); // Revalida
    }
    this.dataAdmissao = novaData;
    this.dataAtualizacao = new Date();
  }
}

export { Funcionario };