import { Plano, StatusEmpresa } from "@prisma/client";


export interface CriarEmpresaDTO {
  nome: string;
  cnpj: string | null;
  email: string;
  status: StatusEmpresa;
  plano: Plano;
}
