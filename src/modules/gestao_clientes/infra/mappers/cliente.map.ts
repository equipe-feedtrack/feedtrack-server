import { ClienteResponseDTO } from "@modules/gestao_clientes/application/dto/cliente_response.dto";
import { Cliente } from "@modules/gestao_clientes/domain/cliente.entity";
import { ICliente, StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";
import { ProdutoMap } from "@modules/produtos/infra/mappers/produto.map";
import { 
    Cliente as ClientePrisma, 
    Produto as ProdutoPrisma,
    ClientesOnProdutos, // Importa o tipo da tabela de junção
    StatusUsuario, 
    Prisma 
} from "@prisma/client";
import { PessoaMap } from "@shared/infra/mappers/pessoa.map";

// ✅ CORREÇÃO: Define um tipo que representa a estrutura aninhada da consulta N-N do Prisma.
type ClienteComProdutosAninhadosPrisma = ClientePrisma & {
  produtos: (ClientesOnProdutos & {
    produto: ProdutoPrisma;
  })[];
};

export class ClienteMap {

    private static statusToDomain(status: StatusUsuario): StatusCliente {
        switch (status) {
            case StatusUsuario.ATIVO: return StatusCliente.ATIVO;
            case StatusUsuario.INATIVO: return StatusCliente.INATIVO;
            default: throw new Error(`Status de usuário desconhecido: ${status}`);
        }
    }

    private static statusToPersistence(status: StatusCliente): StatusUsuario {
        switch (status) {
            case StatusCliente.ATIVO: return StatusUsuario.ATIVO;
            case StatusCliente.INATIVO: return StatusUsuario.INATIVO;
            default: throw new Error(`Status de cliente desconhecido: ${status}`);
        }
    }

    /**
     * Converte um objeto de dados do Prisma (com relação N-N aninhada) para a entidade de domínio Cliente.
     */
    public static toDomain(raw: ClienteComProdutosAninhadosPrisma): Cliente {
        
        const pessoaDomain = PessoaMap.toDomain(raw);

        // ✅ CORREÇÃO: Mapeia a estrutura aninhada para extrair apenas os produtos.
        const produtosDeDominio = (raw.produtos ?? []).map(itemDaJuncao => 
            ProdutoMap.toDomain(itemDaJuncao.produto)
        );

        const clienteProps: ICliente = {
            id: raw.id,
            pessoa: pessoaDomain,
            cidade: raw.cidade ?? null,
            vendedorResponsavel: raw.vendedorResponsavel, 
            status: this.statusToDomain(raw.status),
            produtos: produtosDeDominio, // Usa a lista de produtos desembrulhada
            dataCriacao: raw.dataCriacao,
            dataAtualizacao: raw.dataAtualizacao,
            dataExclusao: raw.dataExclusao ?? null,
        };

        return Cliente.recuperar(clienteProps);
    }

    /**
     * Converte a entidade de domínio Cliente para um objeto de persistência do Prisma.
     * Nota: A relação com produtos não é tratada aqui, mas sim no repositório.
     */
    public static toPersistence(cliente: Cliente): Omit<Prisma.ClienteCreateInput, 'produtos'> {
        
        return {
            id: cliente.id,
            nome: cliente.pessoa.nome,
            email: cliente.pessoa.email ?? null,
            telefone: cliente.pessoa.telefone ?? '',
            cidade: cliente.cidade ?? '',
            vendedorResponsavel: cliente.vendedorResponsavel,
            status: this.statusToPersistence(cliente.status ?? StatusCliente.ATIVO),
            dataCriacao: cliente.dataCriacao,
            dataAtualizacao: cliente.dataAtualizacao,
            dataExclusao: cliente.dataExclusao,
        };
    }

    /**
     * Converte a entidade de domínio Cliente para um DTO de resposta da API.
     */
    public static toResponseDTO(cliente: Cliente): ClienteResponseDTO {
        
        const pessoaDTO = PessoaMap.toDTO(cliente.pessoa);

        return {
            id: cliente.id,
            pessoa: pessoaDTO,
            cidade: cliente.cidade ?? null,
            vendedorResponsavel: cliente.vendedorResponsavel,
            status: cliente.status,
            produtos: cliente.produtos.map(produto => ProdutoMap.toDTO(produto)),
            dataCriacao: cliente.dataCriacao.toISOString(),
            dataAtualizacao: cliente.dataAtualizacao.toISOString(),
            dataExclusao: cliente.dataExclusao ? cliente.dataExclusao.toISOString() : null,
        };
    }
}
