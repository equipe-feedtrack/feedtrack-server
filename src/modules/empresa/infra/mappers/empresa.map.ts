import { Empresa as EmpresaPersistence } from "@prisma/client";
import { Empresa } from "../../domain/empresa.entity";

export class EmpresaMap {
  public static toDomain(raw: EmpresaPersistence): Empresa {
    const empresa = Empresa.create(
      {
        nome: raw.nome,
        cnpj: raw.cnpj ?? '',
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
      dataCriacao: empresa.props.dataCriacao, // Adicionado
      dataAtualizacao: empresa.props.dataAtualizacao, // Adicionado
      dataExclusao: empresa.props.dataExclusao ?? null, // Adicionado
    };
  }
}