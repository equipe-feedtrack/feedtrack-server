import { Entity } from "@shared/domain/entity";
import { Plano, StatusEmpresa } from '@prisma/client'
import { CriarEmpresaProps, EmpresaProps } from "./empresa.types";
import { randomUUID } from "crypto";

export class Empresa extends Entity<EmpresaProps> {

  private _nome: string;
  private _cnpj: string | null;
  private _plano: Plano;
  private _status: StatusEmpresa;
  private _email: string | null;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

  public get nome(): string {
    return this._nome;
  }
  public set nome(value: string) {
    this._nome = value;
  }
  
  public get cnpj(): string | null {
    return this._cnpj;
  }
  public set cnpj(value: string | null) {
    this._cnpj = value;
  }
 
  public get plano(): Plano {
    return this._plano;
  }

  public set plano(value: Plano) {
    this._plano = value;
  }

  public get status(): StatusEmpresa {
    return this._status;
  }

  public set status(value: StatusEmpresa) {
    this._status = value;
  }
  
  public get email(): string | null {
    return this._email;
  }
  public set email(value: string | null) {
    this._email = value;
  }
  
  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  public set dataCriacao(value: Date) {
    this._dataCriacao = value;
  }
  
  public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }

  public set dataAtualizacao(value: Date) {
    this._dataAtualizacao = value;
  }
  
  public get dataExclusao(): Date | null {
    return this._dataExclusao;
  }

  public set dataExclusao(value: Date | null) {
    this._dataExclusao = value;
  }


  private constructor(empresa: EmpresaProps) {
    super(empresa.id);
    this.nome = empresa.nome;
    this.cnpj = empresa.cnpj;
    this.plano = empresa.plano;
    this.status = empresa.status;
    this.email = empresa.email;
    this.dataCriacao = empresa.dataCriacao;
    this.dataAtualizacao = empresa.dataAtualizacao;
    this.dataExclusao = empresa.dataExclusao;
  }

  public static create(empresa: CriarEmpresaProps): Empresa {
    const empresaCompleto: EmpresaProps = {
      id: randomUUID(),
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      email: empresa.email,
      plano: empresa.plano,
      status: "ATIVO",
      dataCriacao: new Date(), // <-- Geramos a data de criação
      dataAtualizacao: new Date(), // <-- Geramos a data de atualização
      dataExclusao: null, // <-- Default para null
    };
      return new Empresa(empresaCompleto);
  }

  public static recuperar(data: EmpresaProps): Empresa {
    return new Empresa(data);
  }
}
