import { Plano, StatusEmpresa } from "@prisma/client";


export interface CriarEmpresaDTO {
  nome: string;
  cnpj?: string;
  email: string;
  plano: Plano;
}
