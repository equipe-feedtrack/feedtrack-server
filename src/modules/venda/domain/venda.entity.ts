import { Entity } from "@shared/domain/entity";
import { CriarVendaProps, VendaProps } from "./venda.types";
import { C } from "vitest/dist/chunks/environment.d.cL3nLXbE";
import { randomUUID } from "crypto";

export class Venda extends Entity<VendaProps> {

  private _clienteId: string;
  private _produtoId: string;
  private _empresaId: string;
  private _dataVenda: Date;
  // Getters para acesso seguro às propriedades
  public get clienteId(): string {
    return this._clienteId;
  }

  private set clienteId(value: string) {
    this._clienteId = value;
  }

  public get produtoId(): string {
    return this._produtoId;
  }

  private set produtoId(value: string) {
    this._produtoId = value;
  }

  public get empresaId(): string {
    return this._empresaId;
  }

  private set empresaId(value: string) {
    this._empresaId = value;
  }

  public get dataVenda(): Date {
    return this._dataVenda;
  }

  private set dataVenda(value: Date) {
    this._dataVenda = value;
  }

  private constructor(venda: VendaProps) {
    super(venda.id);
    this.clienteId = venda.clienteId;
    this.produtoId = venda.produtoId;
    this.empresaId = venda.empresaId;
    this.dataVenda = venda.dataVenda;
  }

  /**
   * Método de fábrica para criar uma nova Venda.
   * Usado para criar uma entidade que ainda não foi persistida.
   * @param props As propriedades da Venda.
   * @param id Opcional, o ID da entidade.
   * @returns Uma nova instância de Venda.
   */
  public static create(props: CriarVendaProps ): Venda {
    const vendaCompleta = {
      ...props,
      id: randomUUID(),
      dataVenda: new Date(),
    };

    return new Venda(vendaCompleta);
  }

  /**
   * Método de fábrica para recuperar uma Venda do banco de dados.
   * Usado para re-hidratar a entidade a partir de dados persistidos.
   * @param props As propriedades da Venda.
   * @param id O ID da entidade, obrigatório para recuperação.
   * @returns Uma nova instância de Venda.
   */
  public static recuperar(props: VendaProps): Venda {
    return new Venda(props);
  }
}