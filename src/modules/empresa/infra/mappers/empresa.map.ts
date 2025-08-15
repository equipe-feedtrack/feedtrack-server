import { Empresa as EmpresaPersistence, StatusEmpresa, Plano } from "@prisma/client";
import { Empresa } from "../../domain/empresa.entity";

export class EmpresaMap {
  public static toDomain(raw: EmpresaPersistence): Empresa {
    // We assume there's a 'recuperar' static method in the domain entity
    // to rebuild the object from persistent data.
    // This is the correct way to handle re-hydration of an entity that already exists.
    const empresa = Empresa.recuperar({
      id: raw.id,
      nome: raw.nome,
      cnpj: raw.cnpj,
      email: raw.email,
      plano: raw.plano,
      status: raw.status,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
      dataExclusao: raw.dataExclusao,
    });

    return empresa;
  }

  public static toPersistence(empresa: Empresa): EmpresaPersistence {

    return {
      id: empresa.id, 
      nome: empresa.nome,
      cnpj: empresa.cnpj ?? null,
      email: empresa.email ?? null,
      plano: empresa.plano,
      status: empresa.status,
      dataCriacao: empresa.dataCriacao,
      dataAtualizacao: empresa.dataAtualizacao,
      dataExclusao: empresa.dataExclusao,
    };
  }
}