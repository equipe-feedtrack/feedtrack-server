import { Cliente } from "modules/gestao_clientes/domain/cliente/cliente.entity";
import { ICliente, CriarClienteProps } from "modules/gestao_clientes/domain/cliente/cliente.types";
import { ProdutoMap } from "./produto.map";
import { PrismaClient } from "@prisma/client";

class ClienteMap {
    public static toDTO(cliente: Cliente): ICliente {
        return {
            id: cliente.id,
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email,
            cidade: cliente.cidade,
            dataCadastro: cliente.dataCadastro,
            ativo: cliente.ativo,
            vendedorResponsavel: cliente.vendedorResponsavel,
            produtos: cliente.produtos.map((produto) => { return ProdutoMap.toDTO(produto) }),

        }


    }

    public static toStatusClientePrisma(cliente: Cliente): typeof PrismaClient["$Enums"]["StatusClientePrisma"] {
        return cliente.ativo ? PrismaClient["$Enums"]["StatusClientePrisma"]["ATIVO"] : PrismaClient["$Enums"]["StatusClientePrisma"]["INATIVO"];
    }

}

export { ClienteMap }