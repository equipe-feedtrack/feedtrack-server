import { ProdutoResponseDTO } from "@modules/produtos/application/dto/produto_response.dto";
import { Produto } from "@modules/produtos/domain/produto.entity";
import { RecuperarProdutoProps } from "@modules/produtos/domain/produto.types";
import { Produto as ProdutoPrisma, Prisma, PrismaClient } from '@prisma/client';

class ProdutoMap {
    
    public static toDomain(produto: ProdutoPrisma): Produto {
       const produtoProps: RecuperarProdutoProps = {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            dataCriacao: produto.dataCriacao,
            dataAtualizacao: produto.dataAtualizacao,
            dataExclusao: produto.dataExclusao ?? null, 
            ativo: produto.ativo,
        };
        return Produto.recuperar(produtoProps);
    }

    /**
     * Converte a entidade de domínio Produto para um objeto de persistência do Prisma.
     * Usado ao salvar/atualizar dados no banco.
     */
    public static toPersistence(produto: Produto) {
        // Mapeia o status do domínio para o enum do Prisma (se nomes forem diferentes, ou se Prisma só aceitar strings)
        // Se StatusProduto e Status_produtos (do Prisma) tiverem os mesmos valores, um casting direto é comum.

        return {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            ativo: produto.ativo,
            data_criacao: produto.dataCriacao,
            data_atualizacao: produto.dataAtualizacao,
            data_exclusao: produto.dataExclusao ?? null, // undefined na entidade -> null no DB
        };
    }

    public static toDTO(produto: Produto): ProdutoResponseDTO {
        return {
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            dataCriacao: produto.dataCriacao.toISOString(), // Converte Date para string ISO
            dataAtualizacao: produto.dataAtualizacao.toISOString(), // Converte Date para string ISO
            dataExclusao: produto.dataExclusao ? produto.dataExclusao.toISOString() : undefined, // Trata null/undefined
            ativo: produto.ativo,
        };
    }

}

export { ProdutoMap }