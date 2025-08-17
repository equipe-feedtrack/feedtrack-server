import { Empresa as EmpresaPersistence, StatusUsuario, TipoUsuario } from "@prisma/client";
import { Empresa } from "../../domain/empresa.entity";


type EmpresaComRelacionamentosPrisma = EmpresaPersistence & {
  usuarios: any[];
  funcionarios: any[];
  clientes: any[];
  campanhas: any[];
  formularios: any[];
  envios: any[];
  feedbacks: any[];
  produtos: any[];
  vendas: any[];
  perguntas: any[];
};

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

public static allWithRelationsCount(raws: EmpresaComRelacionamentosPrisma[]): any[] {
    return raws.map(raw => ({
      id: raw.id,
      nome: raw.nome,
      cnpj: raw.cnpj,
      email: raw.email,
      status: raw.status,
      plano: raw.plano,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
      dataExclusao: raw.dataExclusao,
      // Quantidade de cada relacionamento
      qtdUsuarios: raw.usuarios.length,
      qtdFuncionarios: raw.funcionarios.length,
      qtdClientes: raw.clientes.length,
      qtdCampanhas: raw.campanhas.length,
      qtdFormularios: raw.formularios.length,
      qtdEnvios: raw.envios.length,
      qtdFeedbacks: raw.feedbacks.length,
      qtdProdutos: raw.produtos.length,
      qtdVendas: raw.vendas.length,
      qtdPerguntas: raw.perguntas.length,
    }));
  }

  
}