import { Empresa as EmpresaPersistence } from "@prisma/client";
import { Empresa } from "../../domain/empresa.entity";

export class EmpresaMap {
  public static toDomain(raw: EmpresaPersistence): Empresa {
    const empresa = Empresa.create(
      {
        nome: raw.nome,
        cnpj: raw.cnpj ?? '',
        email: raw.email,
        status: raw.status,
        plano: raw.plano,
        dataCriacao: raw.dataCriacao,
        dataAtualizacao: raw.dataAtualizacao,
        dataExclusao: raw.dataExclusao,
      },
      raw.id
    );
    return empresa;
  }

  public static toPersistence(empresa: Empresa): EmpresaPersistence {
    return {
      id: empresa.id.toString(),
      nome: empresa.props.nome,
      cnpj: empresa.props.cnpj ?? '',
      email: empresa.props.email ?? '',
      plano: empresa.props.plano,
      status: empresa.props.status,
      dataCriacao: empresa.props.dataCriacao, // Adicionado
      dataAtualizacao: empresa.props.dataAtualizacao, // Adicionado
      dataExclusao: empresa.props.dataExclusao ?? null, // Adicionado
    };
  }
}