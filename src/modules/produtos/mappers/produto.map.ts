
import { Produto } from "../produto.entity";
import { IProduto, RecuperarProdutoProps, StatusProduto } from "modules/produtos/produto.types";
import { PrismaClient } from "@prisma/client";


class ProdutoMap {

    public static toDTO(produto: Produto): IProduto {
        return {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          valor: produto.valor,
          dataCriacao: produto.dataCriacao,
          dataAtualizacao: produto.dataAtualizacao,
          dataExclusao: produto.dataExclusao,
          status: produto.status
        }
    }

    public static toDomain(produto: RecuperarProdutoProps): Produto {
        return Produto.recuperar(produto);
    }

        

    public static toStatusProdutoPrisma(status: StatusProduto): typeof PrismaClient["$Enums"]["StatusProdutoPrisma"] {
        return PrismaClient["$Enums"]["StatusProdutoPrisma"][status.toString() as keyof typeof PrismaClient["$Enums"]["StatusProdutoPrisma"]];
    }

}

export { ProdutoMap }