import { PrismaClient } from "@prisma/client";
import { ICliente } from "@modules/gestao_clientes/domain/cliente/cliente.types";
import { Cliente } from "@modules/gestao_clientes/domain/cliente/cliente.entity";
import { ProdutoMap } from "@modules/produtos/mappers/produto.map";

class ClienteMap {
    public static toDTO(cliente: Cliente): ICliente {
        return {
            id: cliente.id,
            pessoa: cliente.pessoa,
            cidade: cliente.cidade,
            // dataCadastro: cliente.dataCadastro, //Ajustar 
            // ativo: cliente.ativo, //Ajustar
            vendedorResponsavel: cliente.vendedorResponsavel,
            produtos: cliente.produtos.map((produto) => { return ProdutoMap.toDTO(produto) }),

        }
    }

    // public static toStatusClientePrisma(cliente: Cliente): typeof PrismaClient["$Enums"]["StatusClientePrisma"] {
    //     return cliente.ativo ? PrismaClient["$Enums"]["StatusClientePrisma"]["ATIVO"] : PrismaClient["$Enums"]["StatusClientePrisma"]["INATIVO"];
    // }

}

export { ClienteMap }