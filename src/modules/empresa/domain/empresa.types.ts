import { Plano, StatusEmpresa } from "@prisma/client";

export interface EmpresaProps {
  id: string;
  nome: string;
  cnpj: string | null;
  plano: Plano
  status: StatusEmpresa;
  email: string | null ;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao: Date | null;
}

 export type CriarEmpresaProps = Omit<EmpresaProps, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>;