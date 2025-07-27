import { ClienteResponseDTO } from "@modules/gestao_clientes/application/dto/cliente_response.dto";
import { Cliente } from "@modules/gestao_clientes/domain/cliente.entity";
import { ICliente, StatusCliente } from "@modules/gestao_clientes/domain/cliente.types";
import { ProdutoMap } from "@modules/produtos/infra/mappers/produto.map"; // Mapper de Produto
import { Cliente as ClientePrisma, Prisma, Status_usuarios } from "@prisma/client"; // Importe Cliente do Prisma e Status_usuarios
import { PessoaMap } from "@shared/infra/mappers/pessoa.map";


export class ClienteMap {

    /**
     * Converte um objeto de dados brutos do Prisma (ClientePrisma) para a entidade de domínio Cliente.
     * Usado ao recuperar dados do banco.
     */
    public static toDomain(raw: ClientePrisma & { produtos?: Array<any> }): Cliente { // raw inclui produtos para N-N
        // Converte o status do DB (enum String) para o enum de domínio
        const statusDomain = raw.status as StatusCliente;

        const pessoaDomain = PessoaMap.toDomain(raw);

        const clienteProps: ICliente = {
            id: raw.id,
            pessoa: pessoaDomain,
            cidade: raw.cidade ?? undefined,
            vendedorResponsavel: raw.vendedor_responsavel, // Ajustar nome de coluna se for snake_case no DB
            status: statusDomain,
            produtos: (raw.produtos ?? []).map(ProdutoMap.toDomain), // Usa ProdutoMap.toDomain para cada produto
            dataCriacao: raw.data_criacao,
            dataAtualizacao: raw.data_atualizacao,
            dataExclusao: raw.data_exclusao ?? null,
        };

        return Cliente.recuperar(clienteProps);
    }

    /**
     * Converte a entidade de domínio Cliente para um objeto de persistência do Prisma.
     * Usado ao salvar/atualizar dados no banco.
     */
    public static toPersistence(cliente: Cliente) {
        // Converte o status do domínio para o enum do Prisma (se nomes forem diferentes)
        const statusPrisma = cliente.status as Status_usuarios; // Ex: StatusCliente.ATIVO -> Status_usuarios.ATIVO

        return {
            id: cliente.id,
            nome: cliente.pessoa.nome,       // Atributos de Pessoa são "desemaranhados" para as colunas de ClientePrisma
            email: cliente.pessoa.email ?? null,
            telefone: cliente.pessoa.telefone  ?? '',
            cidade: cliente.cidade ?? '',    // DB pode exigir string vazia para campos opcionais
            vendedorResponsavel: cliente.vendedorResponsavel, // Ajustar nome de coluna se for snake_case no DB
            status: statusPrisma,
            data_criacao: cliente.dataCriacao,
            data_atualizacao: cliente.dataAtualizacao,
            data_exclusao: cliente.dataExclusao,
            // A relação N-N de produtos será gerenciada no repositório do Cliente ou através de uma tabela de junção.
            // Não listamos produtos diretamente aqui.
        };
    }

    /**
     * Converte a entidade de domínio Cliente para um DTO de resposta para a API.
     * Este é o método que você estava tentando fazer antes.
     */
    public static toResponseDTO(cliente: Cliente): ClienteResponseDTO {
        // Mapeia a Pessoa para o DTO
        const pessoaDTO = {
            nome: cliente.pessoa.nome,
            email: cliente.pessoa.email,
            telefone: cliente.pessoa.telefone,
        };

        return {
            id: cliente.id,
            pessoa: pessoaDTO,
            cidade: cliente.cidade,
            vendedorResponsavel: cliente.vendedorResponsavel,
            status: cliente.status,
            produtos: cliente.produtos.map(ProdutoMap.toDTO), // Mapeia cada Produto para seu DTO
            dataCriacao: cliente.dataCriacao.toISOString(),
            dataAtualizacao: cliente.dataAtualizacao.toISOString(),
            dataExclusao: cliente.dataExclusao ? cliente.dataExclusao.toISOString() : undefined, // Lida com dataExclusao null
        };
    }
}