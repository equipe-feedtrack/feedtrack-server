import { Entity } from "@shared/domain/entity";
import { randomUUID } from "node:crypto";

export interface VendaProps {
  id?: string;
  clienteId: string;
  produtoId: string;
  empresaId: string;
  dataVenda: Date;
    cliente?: {
    email?: string;
    telefone?: string;
  };
  produto?: {
    nome?: string;
    valor?: number;
    descricao?: string;
  };
}

export interface VendaPersistenceWithRelations {
  id: string;
  clienteId: string;
  produtoId: string;
  empresaId: string;
  dataVenda: Date;
  cliente?: { email?: string | null; telefone?: string | null };
  produto?: { nome?: string | null; valor?: number | null; descricao?: string | null };
}


export class Venda extends Entity<VendaProps> {
  private _clienteId: string;
  private _produtoId: string;
  private _empresaId: string;
  private _dataVenda: Date;

  private _cliente?: { nome?: string; email?: string; telefone?: string };
  private _produto?: { nome?: string; valor?: number; descricao?: string };
  private _empresa?: { nome?: string };

  // Getters
  get clienteId(): string { return this._clienteId; }
  get produtoId(): string { return this._produtoId; }
  get empresaId(): string { return this._empresaId; }
  get dataVenda(): Date { return this._dataVenda; }

  get cliente() { return this._cliente; }
  get produto() { return this._produto; }
  get empresa() { return this._empresa; }

  // Setters
  set cliente(value: { nome?: string; email?: string; telefone?: string } | undefined) { this._cliente = value; }
  set produto(value: { nome?: string; valor?: number; descricao?: string } | undefined) { this._produto = value; }
  set empresa(value: { nome?: string } | undefined) { this._empresa = value; }

  set clienteId(value: string) { this._clienteId = value; }
  set produtoId(value: string) { this._produtoId = value; }
  set empresaId(value: string) { this._empresaId = value; }
  set dataVenda(value: Date) { this._dataVenda = value; }

  private constructor(props: VendaProps) {
    super(props.id);
    this._clienteId = props.clienteId;
    this._produtoId = props.produtoId;
    this._empresaId = props.empresaId;
    this._dataVenda = props.dataVenda;
    this._cliente = props.cliente;
    this._produto = props.produto;
  }

  toJSON(): VendaProps {
    return {
      id: this.id,
      clienteId: this._clienteId,
      produtoId: this._produtoId,
      empresaId: this._empresaId,
      dataVenda: this._dataVenda,
      cliente: this._cliente,
      produto: this._produto,
    };
  }

  // Factory method
  public static create(props: VendaProps): Venda {
    return new Venda({
      id: props.id,
      clienteId: props.clienteId,
      produtoId: props.produtoId,
      empresaId: props.empresaId,
      dataVenda: props.dataVenda,
      cliente: props.cliente,
      produto: props.produto,
    });
  }
}

