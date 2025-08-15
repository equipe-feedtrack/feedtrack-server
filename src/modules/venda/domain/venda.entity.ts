import { Entity } from "@shared/domain/entity";
import { UniqueEntityID } from "@shared/domain/unique-entity-id";

export interface VendaProps {
  clienteId: string;
  produtoId: string;
  empresaId: string;
  dataVenda: Date;
}

export class Venda extends Entity<VendaProps> {
  private constructor(props: VendaProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: VendaProps, id?: UniqueEntityID): Venda {
    return new Venda(props, id);
  }
}
