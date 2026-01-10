import { Entity } from "@shared/domain/entity";
import { Plano, StatusEmpresa } from '@prisma/client'

export interface EmpresaProps {
  nome: string;
  cnpj?: string;
  plano: Plano
  status: StatusEmpresa;
  email: string | null ;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date | null;
}

export class Empresa extends Entity<EmpresaProps> {
  public props: EmpresaProps;

  private constructor(props: EmpresaProps, id?: string) {
    super(id);
    this.props = props;
  }

  public static create(props: EmpresaProps, id?: string): Empresa {
    return new Empresa(props, id);
  }
}
