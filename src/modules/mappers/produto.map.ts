
import { Produto } from "modules/produtos/produto.entity";
import { IProduto, RecuperarProdutoProps, StatusProduto } from "modules/produtos/produto.types";
import { StatusProdutoPrisma } from "@prisma/client";

class ProdutoMap {

    public static toDTO(produto: Produto): IProduto {
        return {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          valor: produto.valor,
          estoque: produto.estoque,
          dataCriacao: produto.dataCriacao,
          dataAtualizacao: produto.dataAtualizacao,
          dataExclusao: produto.dataExclusao,
          status: produto.status
        }
    }

    public static toDomain(produto: RecuperarProdutoProps): Produto {
        return Produto.recuperar(produto);
    }

        

    public static toStatusProdutoPrisma(status: StatusProduto): StatusProdutoPrisma{
        return StatusProdutoPrisma[status.toString() as keyof typeof StatusProdutoPrisma];
    }


}

export { ProdutoMap }